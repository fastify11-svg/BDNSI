<?php

namespace App\Http\Controllers\Center;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $centerId = Auth::user()->center_id;
        
        $orders = Order::where('center_id', $centerId)
            ->orderBy('id', 'desc')
            ->paginate(20);

        return Inertia::render('Center/Order/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $centerId = Auth::user()->center_id;
        
        if ($order->center_id !== $centerId) {
            abort(403, 'Unauthorized access to order.');
        }

        $order->load(['items', 'transactions']);

        return Inertia::render('Center/Order/Show', [
            'order' => $order
        ]);
    }
}
