<?php

namespace App\Services;

use App\Models\Center;
use Illuminate\Support\Facades\Log;

class WorkflowAutomationService
{
    protected CenterRiskService $riskService;

    public function __construct(CenterRiskService $riskService)
    {
        $this->riskService = $riskService;
    }

    /**
     * Run daily automation workflows.
     * This should ideally be called via Laravel Scheduler.
     */
    public function runDailyAutomations()
    {
        $this->enforceCreditLimits();
    }

    /**
     * Enforce credit limits: 
     * Auto-suspend centers that have completely exhausted their credit limit 
     * and have a high risk score.
     */
    public function enforceCreditLimits()
    {
        $centers = Center::where('status', \App\Enums\CenterStatus::Approved)
                         ->where('credit_enabled', true)
                         ->where('credit_limit', '>', 0) // Guard against zero credit limit
                         ->get();

        foreach ($centers as $center) {
            $risk = $this->riskService->evaluateRisk($center);

            // If utilization is over 100% and risk is High, auto-suspend to prevent further registrations
            if ($risk['utilization'] >= 100 && $risk['score'] >= 70) {
                // Double check they haven't already been suspended
                if ($center->status->value === \App\Enums\CenterStatus::Suspended) {
                    continue;
                }

                Log::warning("WorkflowAutomation: Auto-suspending Center [{$center->center_code}] due to critical risk and credit exhaustion.");
                
                $center->status = \App\Enums\CenterStatus::Suspended;
                $center->save();

                // Generate notification or audit log here...
                \App\Models\AuditLog::create([
                    'user_id' => 1, // System admin
                    'event' => 'AUTO_SUSPEND',
                    'auditable_type' => get_class($center),
                    'auditable_id' => $center->id,
                    'new_values' => ['status' => 'suspended', 'reason' => 'Credit exhausted and high risk'],
                    'ip_address' => '127.0.0.1',
                    'user_agent' => 'System Automation'
                ]);
            }
        }
    }
}
