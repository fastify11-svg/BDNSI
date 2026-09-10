<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Center;
use App\Services\CenterRiskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CenterRiskController extends Controller
{
    protected CenterRiskService $riskService;

    public function __construct(CenterRiskService $riskService)
    {
        $this->riskService = $riskService;
    }

    /**
     * Display the risk dashboard.
     *
     * Uses evaluateRiskBatch() to load all risk metrics in 2 aggregate queries
     * instead of N×3 per-center queries — eliminates the previous N+1 issue.
     */
    public function index(Request $request)
    {
        $centers = Center::where('status', 'active')->get();

        // Single batch call: 2 DB queries for all centers combined
        $riskMap = $this->riskService->evaluateRiskBatch($centers);

        $result = $centers->map(function ($center) use ($riskMap) {
            $risk = $riskMap->get($center->id, [
                'score'       => 0,
                'level'       => 'Low',
                'factors'     => [],
                'utilization' => 0.0,
            ]);

            return [
                'id'                   => $center->id,
                'center_name'          => $center->center_name,
                'center_code'          => $center->center_code,
                'owner_name'           => $center->owner_name,
                'current_due'          => $center->current_due,
                'credit_limit'         => $center->credit_limit,
                'credit_limit_enabled' => $center->credit_limit_enabled,
                'risk_score'           => $risk['score'],
                'risk_level'           => $risk['level'],
                'factors'              => $risk['factors'],
            ];
        })->sortByDesc('risk_score')->values();

        return Inertia::render('Admin/CenterRisk/Index', [
            'centers' => $result,
        ]);
    }
}
