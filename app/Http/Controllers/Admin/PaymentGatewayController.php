<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentGateway;
use Inertia\Inertia;

class PaymentGatewayController extends Controller
{
    public function index()
    {
        $gateways = PaymentGateway::all();
        return Inertia::render('Admin/PaymentGateway/Index', [
            'gateways' => $gateways
        ]);
    }

    public function update(Request $request, PaymentGateway $payment_gateway)
    {
        $validated = $request->validate([
            'store_id' => 'nullable|string|max:255',
            'store_password' => 'nullable|string|max:255',
            'signature_key' => 'nullable|string|max:255',
            'is_sandbox' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $payment_gateway->update($validated);

        return redirect()->back()->with('success', 'Gateway settings updated successfully.');
    }
}
