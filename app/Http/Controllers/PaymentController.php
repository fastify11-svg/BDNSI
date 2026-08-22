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

        Log::info('Payment processing initiated via Dynamic Config', [
            'gateway' => $gatewayConfig->name,
            'is_sandbox' => $gatewayConfig->is_sandbox,
            // 'store_id' => $gatewayConfig->store_id, // Use this for API calls
            'amount' => $request->amount,
        ]);
        
        // Example: Initialize SSLCommerz / bKash using $gatewayConfig->store_id and $gatewayConfig->store_password
        
        // Simulating immediate redirect back to success for testing purposes
        return redirect()->route('payment.success', ['trx_id' => uniqid('TRX_')]);
    }

    public function callback(Request $request, $gateway)
    {
        Log::info("Payment Webhook/Callback received for {$gateway}", $request->all());
        
        // Find transaction by ID from request and update status based on gateway response
        // e.g., $trx = Transaction::where('trx_id', $request->input('tran_id'))->first();
        // $trx->update(['status' => 'success', 'gateway_response' => $request->all()]);
        
        return response()->json(['message' => 'Callback received']);
    }

    public function success(Request $request)
    {
        return Inertia::render('Payment/Success', [
            'trx_id' => $request->input('trx_id', 'UNKNOWN'),
            'amount' => $request->input('amount', 0),
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
