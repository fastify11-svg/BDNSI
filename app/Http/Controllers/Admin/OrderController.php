<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('center')->orderBy('id', 'desc')->paginate(20);

        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['center', 'items', 'transactions']);

        return Inertia::render('Admin/Order/Show', [
            'order' => $order
        ]);
    }
}
