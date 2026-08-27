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
     */
    public function index(Request $request)
    {
        $centers = Center::where('status', 'active')->get()->map(function ($center) {
            $risk = $this->riskService->evaluateRisk($center);
            return [
                'id' => $center->id,
                'center_name' => $center->center_name,
                'center_code' => $center->center_code,
                'owner_name' => $center->owner_name,
                'current_due' => $center->current_due,
                'credit_limit' => $center->credit_limit,
                'credit_limit_enabled' => $center->credit_limit_enabled,
                'risk_score' => $risk['score'],
                'risk_level' => $risk['level'],
                'factors' => $risk['factors'],
            ];
        })->sortByDesc('risk_score')->values();

        return Inertia::render('Admin/CenterRisk/Index', [
            'centers' => $centers
        ]);
    }
}
