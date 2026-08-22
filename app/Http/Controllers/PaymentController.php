<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;

class PaymentController extends Controller
{
    public function checkout(Request $request)
    {
        // Fetch only active gateways configured by the Admin
        $gateways = \App\Models\PaymentGateway::where('is_active', true)->get();

        // For demonstration, we're returning the view with dummy data.
        // In a real flow, you'd validate the payable entity (Student/Center/Invoice),
        // create a 'pending' Transaction record, and pass the required amount.
        return Inertia::render('Payment/Checkout', [
            'amount' => $request->input('amount', 500),
            'purpose' => $request->input('purpose', 'Registration Fee'),
            'gateways' => $gateways,
            // 'trx_id' => uniqid('TRX_'), // Example ID
        ]);
    }

    public function process(Request $request)
    {
        $request->validate([
            'gateway' => 'required|string',
            'amount' => 'required|numeric',
        ]);
        
        $gatewayConfig = \App\Models\PaymentGateway::where('slug', $request->gateway)->where('is_active', true)->firstOrFail();
        $trx_id = uniqid('TRX_');

        Log::info('Payment processing initiated via Dynamic Config', [
            'gateway' => $gatewayConfig->name,
            'is_sandbox' => $gatewayConfig->is_sandbox,
            'amount' => $request->amount,
        ]);
        
        if ($request->gateway === 'sslcommerz') {
            $apiUrl = $gatewayConfig->is_sandbox ? 'https://sandbox.sslcommerz.com/gwprocess/v3/api.php' : 'https://securepay.sslcommerz.com/gwprocess/v3/api.php';
            
            $post_data = [];
            $post_data['store_id'] = $gatewayConfig->store_id;
            $post_data['store_passwd'] = $gatewayConfig->store_password;
            $post_data['total_amount'] = $request->amount;
            $post_data['currency'] = "BDT";
            $post_data['tran_id'] = $trx_id;
            $post_data['success_url'] = route('payment.success', ['gateway' => 'sslcommerz']);
            $post_data['fail_url'] = route('payment.failed', ['gateway' => 'sslcommerz']);
            $post_data['cancel_url'] = route('payment.cancel', ['gateway' => 'sslcommerz']);
            
            // Dummy customer info required by SSLCommerz
            $post_data['cus_name'] = "Test Customer";
            $post_data['cus_email'] = "test@mail.com";
            $post_data['cus_add1'] = "Dhaka";
            $post_data['cus_phone'] = "01711111111";

            $response = \Illuminate\Support\Facades\Http::asForm()->post($apiUrl, $post_data);
            $result = $response->json();
            
            if (isset($result['GatewayPageURL'])) {
                return Inertia::location($result['GatewayPageURL']);
            }
            return redirect()->route('payment.failed', ['message' => 'SSLCommerz API Error']);
        } 
        else if ($request->gateway === 'bkash') {
            $baseUrl = $gatewayConfig->is_sandbox ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta' : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
            
            // 1. Grant Token
            $tokenResponse = \Illuminate\Support\Facades\Http::withHeaders([
                'username' => $gatewayConfig->username,
                'password' => $gatewayConfig->password,
            ])->post($baseUrl . '/tokenized/checkout/token/grant', [
                'app_key' => $gatewayConfig->app_key,
                'app_secret' => $gatewayConfig->app_secret,
            ]);
            
            $tokenData = $tokenResponse->json();
            if (!isset($tokenData['id_token'])) {
                return redirect()->route('payment.failed', ['message' => 'bKash Token Error']);
            }
            
            $idToken = $tokenData['id_token'];
            
            // 2. Create Payment
            $createResponse = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => $idToken,
                'X-APP-Key' => $gatewayConfig->app_key,
            ])->post($baseUrl . '/tokenized/checkout/create', [
                'amount' => $request->amount,
                'currency' => 'BDT',
                'intent' => 'sale',
                'merchantInvoiceNumber' => $trx_id,
                'callbackURL' => route('payment.callback', ['gateway' => 'bkash']),
            ]);
            
            $createData = $createResponse->json();
            if (isset($createData['bkashURL'])) {
                return Inertia::location($createData['bkashURL']);
            }
            return redirect()->route('payment.failed', ['message' => 'bKash Create Payment Error']);
        }

        return redirect()->route('payment.failed', ['message' => 'Unsupported Gateway']);
    }

    public function callback(Request $request, $gateway)
    {
        Log::info("Payment Webhook/Callback received for {$gateway}", $request->all());
        
        $gatewayConfig = \App\Models\PaymentGateway::where('slug', $gateway)->where('is_active', true)->first();
        if (!$gatewayConfig) {
            return response()->json(['message' => 'Gateway not found'], 404);
        }

        if ($gateway === 'bkash') {
            $paymentID = $request->query('paymentID');
            $status = $request->query('status');

            if ($status === 'success' && $paymentID) {
                $baseUrl = $gatewayConfig->is_sandbox ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta' : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
                
                // Re-grant token to execute
                $tokenResponse = \Illuminate\Support\Facades\Http::withHeaders([
                    'username' => $gatewayConfig->username,
                    'password' => $gatewayConfig->password,
                ])->post($baseUrl . '/tokenized/checkout/token/grant', [
                    'app_key' => $gatewayConfig->app_key,
                    'app_secret' => $gatewayConfig->app_secret,
                ]);
                $tokenData = $tokenResponse->json();
                
                if (isset($tokenData['id_token'])) {
                    $executeResponse = \Illuminate\Support\Facades\Http::withHeaders([
                        'Authorization' => $tokenData['id_token'],
                        'X-APP-Key' => $gatewayConfig->app_key,
                    ])->post($baseUrl . '/tokenized/checkout/execute', [
                        'paymentID' => $paymentID
                    ]);
                    
                    $executeData = $executeResponse->json();
                    
                    if (isset($executeData['transactionStatus']) && $executeData['transactionStatus'] === 'Completed') {
                        return redirect()->route('payment.success', [
                            'trx_id' => $executeData['trxID'] ?? $paymentID, 
                            'amount' => $executeData['amount'] ?? 0
                        ]);
                    }
                }
            }
            
            return redirect()->route('payment.failed', ['message' => 'bKash Payment Failed or Cancelled']);
        }
        else if ($gateway === 'sslcommerz') {
            // Future IPN signature validation goes here
            return response()->json(['message' => 'SSLCommerz IPN received']);
        }
        
        return response()->json(['message' => 'Callback received']);
    }

    public function success(Request $request)
    {
        // Support both GET (bKash) and POST (SSLCommerz) parameters
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
