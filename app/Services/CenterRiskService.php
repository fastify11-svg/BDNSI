<?php

namespace App\Services;

use App\Models\Center;
use App\Models\Order;
use App\Models\StudentDocument;

class CenterRiskService
{
    protected AnalyticsService $analytics;

    public function __construct(AnalyticsService $analytics)
    {
        $this->analytics = $analytics;
    }

    /**
     * Calculate a risk score for a center (0-100).
     * 0 = No Risk, 100 = Critical Risk.
     *
     * @param Center $center
     * @return array
     */
    public function evaluateRisk(Center $center): array
    {
        $score = 0;
        $factors = [];

        // 1. Credit Utilization Risk
        $utilization = $this->analytics->getCreditUtilization($center->id);
        if ($utilization >= 100) {
            $score += 50;
            $factors[] = 'Credit limit fully exhausted or exceeded.';
        } elseif ($utilization >= 90) {
            $score += 30;
            $factors[] = 'High credit limit utilization (>90%).';
        } elseif ($utilization >= 75) {
            $score += 10;
            $factors[] = 'Moderate credit utilization (>75%).';
        }

        // 2. High Unpaid Orders Risk
        $unpaidOrders = Order::where('center_id', $center->id)
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->where('due_amount', '>', 0)
            ->count();
            
        if ($unpaidOrders > 50) {
            $score += 20;
            $factors[] = 'High volume of unpaid/partially paid orders (>50).';
        } elseif ($unpaidOrders > 20) {
            $score += 10;
            $factors[] = 'Significant volume of unpaid orders (>20).';
        }

        // 3. Document Rejection Rate Risk
        $docStats = $this->analytics->getDocumentApprovalStats($center->id);
        if ($docStats['total'] > 10) {
            $rejectionRate = ($docStats['rejected'] / $docStats['total']) * 100;
            if ($rejectionRate > 30) {
                $score += 30;
                $factors[] = 'High document rejection rate (>' . round($rejectionRate) . '%).';
            } elseif ($rejectionRate > 15) {
                $score += 15;
                $factors[] = 'Moderate document rejection rate.';
            }
        }

        // Cap score at 100
        $score = min(100, $score);

        $level = 'Low';
        if ($score >= 70) {
            $level = 'High';
        } elseif ($score >= 40) {
            $level = 'Medium';
        }

        return [
            'score' => $score,
            'level' => $level,
            'factors' => $factors,
            'utilization' => $utilization,
        ];
    }
}
