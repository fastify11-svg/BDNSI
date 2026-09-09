<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Services\CommissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommissionController extends Controller
{
    protected $commissionService;

    public function __construct(CommissionService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    public function index(Request $request)
    {
        $commissions = Commission::with(['team', 'order', 'transaction', 'policy'])
            ->latest()
            ->paginate(20);
            
        // Pre-fetch aggregate stats for all teams to avoid N+1 and O(N) loops
        $teamIds = Commission::distinct()->pluck('team_id')->filter()->values();
        
        $teams = \App\Models\Team::whereIn('id', $teamIds)->get()->keyBy('id');
        
        $policies = \App\Models\CommissionPolicy::where('is_active', true)
            ->where(function ($q) use ($teamIds) {
                $q->whereIn('team_id', $teamIds)->orWhereNull('team_id');
            })
            ->orderBy('team_id', 'desc')
            ->get()
            ->keyBy('team_id');

        // Note: null key might exist for universal policies, handled below

        $aggregates = Commission::whereIn('team_id', $teamIds)
            ->selectRaw('
                team_id,
                SUM(CASE WHEN status IN ("Earned", "Pending") THEN amount ELSE 0 END) as earned,
                SUM(CASE WHEN status = "Approved" THEN amount ELSE 0 END) as approved,
                SUM(CASE WHEN status = "Paid" THEN amount ELSE 0 END) as paid,
                SUM(calculated_revenue) as revenue
            ')
            ->groupBy('team_id')
            ->get()
            ->keyBy('team_id');

        $agentSummaries = $teamIds->map(function ($teamId) use ($teams, $policies, $aggregates) {
            $team   = $teams->get($teamId);
            $policy = $policies->get($teamId) ?? $policies->get(null) ?? $policies->first();
            $agg    = $aggregates->get($teamId);

            $earned   = (float) ($agg->earned ?? 0);
            $approved = (float) ($agg->approved ?? 0);
            $paid     = (float) ($agg->paid ?? 0);
            $revenue  = (float) ($agg->revenue ?? 0);

            return [
                'team_id'         => $teamId,
                'team_name'       => $team ? $team->name : 'N/A',
                'earned'          => number_format($earned, 2),
                'approved'        => number_format($approved, 2),
                'paid'            => number_format($paid, 2),
                'remaining'       => number_format($earned + $approved, 2),
                'total_revenue'   => number_format($revenue, 2),
                'commission_rate' => $policy ? ($policy->type === 'percentage' ? $policy->value . '%' : '৳' . number_format($policy->value, 2) . ' (fixed)') : 'N/A',
                'policy_type'     => $policy ? $policy->type : null,
                'policy_value'    => $policy ? $policy->value : null,
            ];
        })->filter()->values();


        // Overall platform totals
        $overallTotals = [
            'earned'   => number_format((float)Commission::whereIn('status', ['Earned', 'Pending'])->sum('amount'), 2),
            'approved' => number_format((float)Commission::where('status', 'Approved')->sum('amount'), 2),
            'paid'     => number_format((float)Commission::where('status', 'Paid')->sum('amount'), 2),
        ];

        return Inertia::render('Admin/Commissions/Index', [
            'commissions'   => $commissions,
            'agentSummaries' => $agentSummaries,
            'overallTotals' => $overallTotals,
        ]);
    }

    public function show(Commission $commission)
    {
        $commission->load(['team', 'order.items.itemable', 'transaction', 'policy']);
        
        return Inertia::render('Admin/Commissions/Show', [
            'commission' => $commission
        ]);
    }

    public function approve(Request $request, Commission $commission)
    {
        try {
            $this->commissionService->approve($commission, auth()->id());
            return redirect()->back()->with('success', 'Commission approved successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function pay(Request $request, Commission $commission)
    {
        try {
            $this->commissionService->pay($commission, auth()->id());
            return redirect()->back()->with('success', 'Commission marked as paid.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function reverse(Request $request, Commission $commission)
    {
        $request->validate(['reason' => 'required|string|max:255']);
        
        try {
            $this->commissionService->reverse($commission, auth()->id(), $request->reason);
            return redirect()->back()->with('success', 'Commission reversed successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
