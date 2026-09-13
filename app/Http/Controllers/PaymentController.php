<?php

namespace App\Http\Controllers;

use App\Events\PaymentSucceeded;
use App\Models\Order;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function checkout(Request $request)
    {
        $gateways = PaymentGateway::where('is_active', true)->get();
        $user = auth()->user() ?? auth('admin')->user();

        $order = null;
        if ($request->has('order_id')) {
            $order = Order::findOrFail($request->order_id);
            if ($user instanceof User && $user->center_id && (int) $order->center_id !== (int) $user->center_id) {
                abort(403);
            }
            $amount = $order->due_amount;
            $purpose = 'Payment for Order #'.$order->order_number;
        } else {
            // Never trust client-supplied money on checkout.
            $amount = config('site.setting.registration_fee', 500);
            $purpose = $request->input('purpose', 'Registration Fee');
        }

        return Inertia::render('Payment/Checkout', [
            'amount' => $amount,
            'purpose' => $purpose,
            'gateways' => $gateways,
            'order_id' => $order ? $order->id : null,
        ]);
    }

    public function process(Request $request)
    {
        $request->validate([
            'gateway' => 'required|string',
            'order_id' => 'nullable|exists:orders,id',
            'purpose' => 'nullable|string|max:255',
        ]);

        $user = auth()->user() ?? auth('admin')->user();
        if (! $user) {
            abort(403, 'Authentication required to initiate payment.');
        }

        $gatewayConfig = PaymentGateway::where('slug', $request->gateway)->where('is_active', true)->firstOrFail();
        $trx_id = uniqid('TRX_');

        $order = null;
        if ($request->filled('order_id')) {
            $order = Order::findOrFail($request->order_id);
            if ($user instanceof User && $user->center_id && (int) $order->center_id !== (int) $user->center_id) {
                abort(403, 'You are not allowed to pay for this order.');
            }
            $amount = $order->due_amount;
            if (bccomp((string) $amount, '0', 2) !== 1) {
                return redirect()->route('payment.failed', ['message' => 'Order has no outstanding due amount.']);
            }
            $payableType = Order::class;
            $payableId = $order->id;
            $purpose = 'Payment for Order #'.$order->order_number;
        } else {
            $amount = config('site.setting.registration_fee', 500);
            $payableType = get_class($user);
            $payableId = $user->id;
            $purpose = $request->input('purpose', 'Registration Fee');
        }

        Transaction::create([
            'trx_id' => $trx_id,
            'amount' => $amount,
            'gateway' => $request->gateway,
            'status' => 'pending',
            'purpose' => $purpose,
            'payable_type' => $payableType,
            'payable_id' => $payableId,
        ]);

        Log::info('Payment processing initiated via Dynamic Config', [
            'gateway' => $gatewayConfig->name,
            'is_sandbox' => $gatewayConfig->is_sandbox,
            'amount' => $amount,
            'trx_id' => $trx_id,
            'order_id' => $order?->id,
        ]);

        if ($request->gateway === 'sslcommerz') {
            $apiUrl = $gatewayConfig->is_sandbox
                ? 'https://sandbox.sslcommerz.com/gwprocess/v3/api.php'
                : 'https://securepay.sslcommerz.com/gwprocess/v3/api.php';

            $post_data = [
                'store_id' => $gatewayConfig->store_id,
                'store_passwd' => $gatewayConfig->store_password,
                'total_amount' => $amount,
                'currency' => 'BDT',
                'tran_id' => $trx_id,
                'success_url' => route('payment.success', ['gateway' => 'sslcommerz']),
                'fail_url' => route('payment.failed', ['gateway' => 'sslcommerz']),
                'cancel_url' => route('payment.cancel', ['gateway' => 'sslcommerz']),
                'ipn_url' => route('payment.callback', ['gateway' => 'sslcommerz']),
                'cus_name' => $user->name ?? 'BDNSI Student',
                'cus_email' => $user->email ?? 'student@bdnsi.com',
                'cus_add1' => 'Dhaka, Bangladesh',
                'cus_phone' => $user->phone ?? '01700000000',
            ];

            $result = Http::asForm()->post($apiUrl, $post_data)->json();

            if (isset($result['GatewayPageURL'])) {
                return Inertia::location($result['GatewayPageURL']);
            }

            return redirect()->route('payment.failed', ['message' => 'SSLCommerz API Error']);
        }

        if ($request->gateway === 'bkash') {
            $baseUrl = $gatewayConfig->is_sandbox
                ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
                : 'https://tokenized.pay.bka.sh/v1.2.0-beta';

            $tokenData = Http::withHeaders([
                'username' => $gatewayConfig->username,
                'password' => $gatewayConfig->password,
            ])->post($baseUrl.'/tokenized/checkout/token/grant', [
                'app_key' => $gatewayConfig->app_key,
                'app_secret' => $gatewayConfig->app_secret,
            ])->json();

            if (! isset($tokenData['id_token'])) {
                return redirect()->route('payment.failed', ['message' => 'bKash Token Error']);
            }

            $createData = Http::withHeaders([
                'Authorization' => $tokenData['id_token'],
                'X-APP-Key' => $gatewayConfig->app_key,
            ])->post($baseUrl.'/tokenized/checkout/create', [
                'amount' => $amount,
                'currency' => 'BDT',
                'intent' => 'sale',
                'merchantInvoiceNumber' => $trx_id,
                'callbackURL' => route('payment.callback', ['gateway' => 'bkash']),
            ])->json();

            if (isset($createData['bkashURL'])) {
                return Inertia::location($createData['bkashURL']);
            }

            return redirect()->route('payment.failed', ['message' => 'bKash Create Payment Error']);
        }

        return redirect()->route('payment.failed', ['message' => 'Unsupported Gateway']);
    }

    public function callback(Request $request, $gateway)
    {
        Log::info("Payment Webhook/Callback received for {$gateway}", $request->except([
            'store_passwd', 'password', 'card_no', 'card_name', 'cus_name', 'cus_email', 'cus_phone', 'bank_tran_id',
        ]));

        $gatewayConfig = PaymentGateway::where('slug', $gateway)->where('is_active', true)->first();
        if (! $gatewayConfig) {
            return response()->json(['message' => 'Gateway not found'], 404);
        }

        DB::beginTransaction();
        try {
            if ($gateway === 'bkash') {
                $paymentID = $request->query('paymentID');
                $status = $request->query('status');

                if ($status === 'success' && $paymentID) {
                    $baseUrl = $gatewayConfig->is_sandbox
                        ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
                        : 'https://tokenized.pay.bka.sh/v1.2.0-beta';

                    $tokenData = Http::withHeaders([
                        'username' => $gatewayConfig->username,
                        'password' => $gatewayConfig->password,
                    ])->post($baseUrl.'/tokenized/checkout/token/grant', [
                        'app_key' => $gatewayConfig->app_key,
                        'app_secret' => $gatewayConfig->app_secret,
                    ])->json();

                    if (isset($tokenData['id_token'])) {
                        $executeData = Http::withHeaders([
                            'Authorization' => $tokenData['id_token'],
                            'X-APP-Key' => $gatewayConfig->app_key,
                        ])->post($baseUrl.'/tokenized/checkout/execute', [
                            'paymentID' => $paymentID,
                        ])->json();

                        if (isset($executeData['transactionStatus']) && $executeData['transactionStatus'] === 'Completed') {
                            $trxID = $executeData['merchantInvoiceNumber']
                                ?? $executeData['trxID']
                                ?? $paymentID;

                            $transaction = Transaction::where('trx_id', $trxID)->lockForUpdate()->first();
                            if ($transaction) {
                                if (isset($executeData['amount']) && bccomp((string) $executeData['amount'], (string) $transaction->amount, 2) !== 0) {
                                    Log::warning('bKash callback amount mismatch', [
                                        'trx_id' => $trxID,
                                        'expected' => $transaction->amount,
                                        'gateway_amount' => $executeData['amount'],
                                    ]);
                                    DB::commit();

                                    return redirect()->route('payment.failed', ['message' => 'bKash amount mismatch']);
                                }

                                if ($transaction->status !== 'success') {
                                    $transaction->update([
                                        'status' => 'success',
                                        'gateway_response' => $executeData,
                                    ]);
                                    event(new PaymentSucceeded($transaction->fresh(), $transaction->payable));
                                }
                            }

                            DB::commit();

                            return redirect()->route('payment.success', [
                                'trx_id' => $trxID,
                                'amount' => $transaction->amount ?? ($executeData['amount'] ?? 0),
                            ]);
                        }
                    }
                }

                DB::commit();

                return redirect()->route('payment.failed', ['message' => 'bKash Payment Failed or Cancelled']);
            }

            if ($gateway === 'sslcommerz') {
                $val_id = $request->input('val_id');
                $status = $request->input('status');
                $tran_id = $request->input('tran_id');

                if ($status === 'VALID' && $val_id) {
                    $apiUrl = $gatewayConfig->is_sandbox
                        ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
                        : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

                    $result = Http::get($apiUrl, [
                        'val_id' => $val_id,
                        'store_id' => $gatewayConfig->store_id,
                        'store_passwd' => $gatewayConfig->store_password,
                        'v' => 1,
                        'format' => 'json',
                    ])->json();

                    if (isset($result['status']) && ($result['status'] === 'VALID' || $result['status'] === 'VALIDATED')) {
                        $transaction = Transaction::where('trx_id', $tran_id)->lockForUpdate()->first();
                        if ($transaction) {
                            if (isset($result['amount']) && bccomp((string) $result['amount'], (string) $transaction->amount, 2) !== 0) {
                                Log::warning('SSLCommerz IPN amount mismatch', [
                                    'trx_id' => $tran_id,
                                    'expected' => $transaction->amount,
                                    'gateway_amount' => $result['amount'],
                                ]);
                                DB::commit();

                                return response()->json(['message' => 'SSLCommerz IPN Invalid'], 400);
                            }

                            if ($transaction->status !== 'success') {
                                $transaction->update([
                                    'status' => 'success',
                                    'gateway_response' => $result,
                                ]);
                                event(new PaymentSucceeded($transaction->fresh(), $transaction->payable));
                            }
                        }

                        DB::commit();

                        return response()->json(['message' => 'SSLCommerz IPN Verified successfully']);
                    }
                }

                Transaction::where('trx_id', $tran_id)->update(['status' => 'failed']);
                DB::commit();

                return response()->json(['message' => 'SSLCommerz IPN Invalid'], 400);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment callback error: '.$e->getMessage());

            return response()->json(['message' => 'Callback error'], 500);
        }

        DB::commit();

        return response()->json(['message' => 'Callback received']);
    }

    public function success(Request $request)
    {
        $trx_id = $request->input('trx_id') ?? $request->input('tran_id') ?? 'UNKNOWN';
        $amount = $request->input('amount') ?? 0;

        return Inertia::render('Payment/Success', [
            'trx_id' => $trx_id,
            'amount' => $amount,
        ]);
    }

    public function failed(Request $request)
    {
        return Inertia::render('Payment/Failed', [
            'error_message' => $request->input('message', 'Payment process failed or was declined.'),
        ]);
    }

    public function cancel(Request $request)
    {
        return Inertia::render('Payment/Cancelled', [
            'message' => 'You cancelled the payment process.',
        ]);
    }
}
