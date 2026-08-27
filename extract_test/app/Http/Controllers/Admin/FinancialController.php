<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['student', 'center'])->latest();

        if ($request->has('purpose') && $request->purpose) {
            $query->where('purpose', $request->purpose);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $payments = $query->paginate(15)->withQueryString();

        $stats = [
            'total_revenue' => Payment::where('status', 'paid')->sum('amount'),
            'registration_revenue' => Payment::where('status', 'paid')->where('purpose', 'registration_fee')->sum('amount'),
            'certificate_revenue' => Payment::where('status', 'paid')->where('purpose', 'certificate_sale')->sum('amount'),
            'pending_payments' => Payment::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Financial/Index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['purpose', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'purpose' => 'required|string',
            'status' => 'required|string',
            'student_id' => 'nullable|exists:students,id',
            'center_id' => 'nullable|exists:centers,id',
            'payment_method' => 'nullable|string',
            'transaction_id' => 'nullable|string',
        ]);

        Payment::create($validated);

        return back()->with('success', 'Payment recorded successfully.');
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $payment->update($request->only('status'));

        return back()->with('success', 'Payment status updated.');
    }
}
