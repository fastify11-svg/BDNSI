<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Price;
use App\Models\Center;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PriceController extends Controller
{
    public function index()
    {
        $prices = Price::with('center')->orderBy('id', 'desc')->get();
        $centers = Center::select('id', 'code', 'name')->get();

        return Inertia::render('Admin/Price/Index', [
            'prices' => $prices,
            'centers' => $centers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'center_id' => 'nullable|exists:centers,id',
            'product_type' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'effective_from' => 'nullable|date',
            'status' => 'boolean'
        ]);

        $validated['discount'] = $validated['discount'] ?? 0;
        $validated['status'] = $validated['status'] ?? true;

        Price::create($validated);

        return back()->with('success', 'Price configured successfully.');
    }
}
