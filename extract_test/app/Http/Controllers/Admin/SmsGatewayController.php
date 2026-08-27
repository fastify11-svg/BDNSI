<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmsGateway;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsGatewayController extends Controller
{
    public function index()
    {
        $gateways = SmsGateway::all();
        return Inertia::render('Admin/SmsGateway/Index', [
            'gateways' => $gateways
        ]);
    }

    public function update(Request $request, SmsGateway $smsGateway)
    {
        $validated = $request->validate([
            'provider_name' => 'required|string',
            'base_url' => 'nullable|url',
            'api_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'sender_id' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->is_active) {
            // Disable others if this one is active (optional, if we only want one active)
            SmsGateway::where('id', '!=', $smsGateway->id)->update(['is_active' => false]);
        }

        $smsGateway->update($validated);

        return redirect()->back()->with('success', 'SMS Gateway updated successfully.');
    }
}
