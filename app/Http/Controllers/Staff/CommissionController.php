<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CommissionController extends Controller
{
    public function index(Request $request)
    {
        $teamId = Auth::guard('staff')->user()->id; // Staff user is a Team model

        $commissions = Commission::with(['order', 'transaction', 'policy'])
            ->where('team_id', $teamId)
            ->latest()
            ->paginate(20);
            
        $totals = [
            'earned' => Commission::where('team_id', $teamId)->where('status', 'Earned')->sum('amount'),
            'approved' => Commission::where('team_id', $teamId)->where('status', 'Approved')->sum('amount'),
            'paid' => Commission::where('team_id', $teamId)->where('status', 'Paid')->sum('amount'),
        ];
            
        return Inertia::render('Staff/Commissions/Index', [
            'commissions' => $commissions,
            'totals' => $totals
        ]);
    }
}
