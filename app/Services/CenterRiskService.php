<?php

namespace App\Services;

use App\Models\Center;
use App\Models\Order;
use App\Models\StudentDocument;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CenterRiskService
{
    protected AnalyticsService $analytics;

    public function __construct(AnalyticsService $analytics)
    {
        $this->analytics = $analytics;
    }

    /**
     * Calculate a risk score for a single center (0-100).
     * 0 = No Risk, 100 = Critical Risk.
     *
     * NOTE: For dashboard use with multiple centers, prefer evaluateRiskBatch()
     * to avoid N+1 queries.
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

        $score = min(100, $score);

        $level = 'Low';
        if ($score >= 70) {
            $level = 'High';
        } elseif ($score >= 40) {
            $level = 'Medium';
        }

        return [
            'score'       => $score,
            'level'       => $level,
            'factors'     => $factors,
            'utilization' => $utilization,
        ];
    }

    /**
     * Batch-evaluate risk for a collection of centers.
     *
     * Uses 2 aggregate queries for all centers instead of N×3 queries,
     * eliminating the N+1 problem on the CenterRisk dashboard.
     *
     * @param Collection $centers  Collection of Center models (must include credit_limit, credit_enabled, current_due)
     * @return Collection          Keyed by center_id, each value is the risk array
     */
    public function evaluateRiskBatch(Collection $centers): Collection
    {
        if ($centers->isEmpty()) {
            return collect();
        }

        $centerIds = $centers->pluck('id')->all();

        // Batch Query 1: Unpaid order counts per center (single query)
        $unpaidCounts = Order::whereIn('center_id', $centerIds)
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->where('due_amount', '>', 0)
            ->select('center_id', DB::raw('COUNT(*) as cnt'))
            ->groupBy('center_id')
            ->pluck('cnt', 'center_id');

        // Batch Query 2: Document approval stats per center (single query)
        $docRows = StudentDocument::whereIn('center_id', $centerIds)
            ->select(
                'center_id',
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected")
            )
            ->groupBy('center_id')
            ->get()
            ->keyBy('center_id');

        return $centers->mapWithKeys(function (Center $center) use ($unpaidCounts, $docRows) {
            $score   = 0;
            $factors = [];

            // 1. Credit utilization — from model attributes (no extra DB query)
            $utilization = 0.0;
            if ($center->credit_enabled && $center->credit_limit > 0) {
                $utilization = round(min(100, ($center->current_due / $center->credit_limit) * 100), 2);
            }
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

            // 2. Unpaid orders — from batch query 1
            $unpaidOrders = (int) $unpaidCounts->get($center->id, 0);
            if ($unpaidOrders > 50) {
                $score += 20;
                $factors[] = 'High volume of unpaid/partially paid orders (>50).';
            } elseif ($unpaidOrders > 20) {
                $score += 10;
                $factors[] = 'Significant volume of unpaid orders (>20).';
            }

            // 3. Document rejection rate — from batch query 2
            $row = $docRows->get($center->id);
            if ($row && $row->total > 10) {
                $rejectionRate = ($row->rejected / $row->total) * 100;
                if ($rejectionRate > 30) {
                    $score += 30;
                    $factors[] = 'High document rejection rate (>' . round($rejectionRate) . '%).';
                } elseif ($rejectionRate > 15) {
                    $score += 15;
                    $factors[] = 'Moderate document rejection rate.';
                }
            }

            $score = min(100, $score);
            $level = 'Low';
            if ($score >= 70) {
                $level = 'High';
            } elseif ($score >= 40) {
                $level = 'Medium';
            }

            return [$center->id => [
                'score'       => $score,
                'level'       => $level,
                'factors'     => $factors,
                'utilization' => $utilization,
            ]];
        });
    }
}
