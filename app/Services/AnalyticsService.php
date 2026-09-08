<?php

namespace App\Services;

use App\Models\Commission;
use App\Models\Order;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get Gross Revenue (Total Amount of non-cancelled orders).
     *
     * @param int|null $centerId
     * @return float
     */
    public function getGrossRevenue($centerId = null): float
    {
        $query = Order::where('status', '!=', Order::STATUS_CANCELLED);
        if ($centerId) {
            $query->where('center_id', $centerId);
        }
        return (float) $query->sum('total_amount');
    }

    /**
     * Get Collected Revenue (Total successful transactions).
     *
     * @param int|null $centerId
     * @return float
     */
    public function getCollectedRevenue($centerId = null): float
    {
        $query = Transaction::where('status', 'success');

        if ($centerId) {
            // Morph relation check
            $query->whereHasMorph('payable', [Order::class], function ($q) use ($centerId) {
                $q->where('center_id', $centerId);
            });
        }

        return (float) $query->sum('amount');
    }

    /**
     * Get Outstanding Order Due.
     *
     * @param int|null $centerId
     * @return float
     */
    public function getOutstandingOrderDue($centerId = null): float
    {
        $query = Order::where('status', '!=', Order::STATUS_CANCELLED)
            ->where('due_amount', '>', 0);
        if ($centerId) {
            $query->where('center_id', $centerId);
        }
        return (float) $query->sum('due_amount');
    }

    /**
     * Get Registration Counts (Total, Paid, Unpaid).
     * Returns an array with 'total', 'paid', 'unpaid'.
     *
     * @param int|null $centerId
     * @return array
     */
    public function getRegistrationCounts($centerId = null): array
    {
        $query = Student::query();
        if ($centerId) {
            $query->where('center_id', $centerId);
        }

        $total = $query->count();
        $paid = (clone $query)->where('payment_status', 1)->count();
        $unpaid = $total - $paid;

        return [
            'total' => $total,
            'paid' => $paid,
            'unpaid' => $unpaid,
        ];
    }

    /**
     * Get count of Orders that are partially paid.
     *
     * @param int|null $centerId
     * @return int
     */
    public function getPartialPaymentCount($centerId = null): int
    {
        $query = Order::where('status', Order::STATUS_PARTIALLY_PAID)
            ->where('paid_amount', '>', 0)
            ->where('due_amount', '>', 0);

        if ($centerId) {
            $query->where('center_id', $centerId);
        }
        return $query->count();
    }

    /**
     * Get Course/Product Demand.
     * Returns a collection of counts grouped by subject.
     *
     * @param int|null $centerId
     * @return \Illuminate\Support\Collection
     */
    public function getCourseDemand($centerId = null)
    {
        $query = Student::select('subject_id', DB::raw('count(*) as total'))
            ->with('subject')
            ->groupBy('subject_id')
            ->orderByDesc('total');

        if ($centerId) {
            $query->where('center_id', $centerId);
        }

        return $query->get()->map(function ($item) {
            return [
                'subject_id' => $item->subject_id,
                'subject_name' => $item->subject ? $item->subject->name : 'Unknown',
                'total' => $item->total,
            ];
        });
    }

    /**
     * Get Document Approval Rate.
     * Returns array with 'total', 'approved', 'rejected', 'pending'.
     *
     * @param int|null $centerId
     * @return array
     */
    public function getDocumentApprovalStats($centerId = null): array
    {
        $query = StudentDocument::query();
        if ($centerId) {
            $query->whereHas('student', function ($q) use ($centerId) {
                $q->where('center_id', $centerId);
            });
        }

        $total = $query->count();
        $approved = (clone $query)->where('status', 'Approved')->count();
        $rejected = (clone $query)->where('status', 'Rejected')->count();
        $pending = $total - ($approved + $rejected);

        $rate = $total > 0 ? round(($approved / $total) * 100, 2) : 0;

        return [
            'total' => $total,
            'approved' => $approved,
            'rejected' => $rejected,
            'pending' => $pending,
            'approval_rate' => $rate,
        ];
    }

    /**
     * Get Certificate Issuance Count.
     * (Students who have a result published)
     *
     * @param int|null $centerId
     * @return int
     */
    public function getCertificateIssuanceCount($centerId = null): int
    {
        $query = Student::whereNotNull('result_publised');
        if ($centerId) {
            $query->where('center_id', $centerId);
        }
        return $query->count();
    }

    /**
     * Get Commission Stats (earned, paid, unpaid) from the authoritative
     * commissions table. Center filtering is performed through each
     * commission's order; CenterLedger does not contain commission entries.
     *
     * @param int|null $centerId
     * @return array
     */
    public function getCommissionStats($centerId = null): array
    {
        $query = Commission::query()
            ->whereNotIn('status', ['Cancelled', 'Reversed']);
        if ($centerId) {
            $query->whereHas('order', function ($orderQuery) use ($centerId) {
                $orderQuery->where('center_id', $centerId);
            });
        }
        $earned = (float) $query->sum('amount');

        $paidQuery = Commission::where('status', 'Paid');
        if ($centerId) {
            $paidQuery->whereHas('order', function ($orderQuery) use ($centerId) {
                $orderQuery->where('center_id', $centerId);
            });
        }
        $paid = (float) $paidQuery->sum('amount');

        $unpaid = $earned - $paid;

        return [
            'earned' => $earned,
            'paid' => $paid,
            'unpaid' => max(0, $unpaid),
        ];
    }

    /**
     * Get Center Current Due based on actual ledger balance.
     *
     * @param int|null $centerId
     * @return float
     */
    public function getCenterCurrentDue($centerId = null): float
    {
        $query = \App\Models\CenterLedger::query();
        if ($centerId) {
            $query->where('center_id', $centerId);
        }
        
        $totalDebit = (float) $query->where('type', 'debit')->sum('amount');
        
        $creditQuery = \App\Models\CenterLedger::query();
        if ($centerId) {
            $creditQuery->where('center_id', $centerId);
        }
        $totalCredit = (float) $creditQuery->where('type', 'credit')->sum('amount');
        
        return max(0, $totalDebit - $totalCredit);
    }

    /**
     * Get Credit Utilization as a percentage.
     *
     * @param int $centerId
     * @return float
     */
    public function getCreditUtilization(int $centerId): float
    {
        $center = \App\Models\Center::find($centerId);
        if (!$center || !$center->credit_enabled || $center->credit_limit <= 0) {
            return 0;
        }

        $due = $this->getCenterCurrentDue($centerId);
        $percentage = ($due / $center->credit_limit) * 100;
        return round(min(100, $percentage), 2);
    }

    /**
     * Get Staff Sales count (number of students registered by a specific staff member).
     *
     * @param int $staffId
     * @param int|null $centerId
     * @return int
     */
    public function getStaffSales(int $staffId, $centerId = null): int
    {
        $query = Student::where('created_by', $staffId);
        if ($centerId) {
            $query->where('center_id', $centerId);
        }
        return $query->count();
    }

    /**
     * Get Revenue Over Time (Daily aggregation)
     *
     * @param string $startDate
     * @param string $endDate
     * @return array
     */
    public function getRevenueOverTime(string $startDate, string $endDate): array
    {
        $query = Order::where('status', '!=', Order::STATUS_CANCELLED)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('date')
            ->orderBy('date');

        return $query->get()->map(function ($item) {
            return [
                'date' => $item->date,
                'revenue' => (float) $item->total,
            ];
        })->toArray();
    }

    /**
     * Get Collection Over Time (Daily aggregation)
     *
     * @param string $startDate
     * @param string $endDate
     * @return array
     */
    public function getCollectionOverTime(string $startDate, string $endDate): array
    {
        $query = Transaction::where('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->orderBy('date');

        return $query->get()->map(function ($item) {
            return [
                'date' => $item->date,
                'collection' => (float) $item->total,
            ];
        })->toArray();
    }

    /**
     * Get Top Sales Agents (by commission earned)
     *
     * @return array
     */
    public function getTopSalesAgents(): array
    {
        return Commission::with('team')
            ->whereNotIn('status', ['Cancelled', 'Reversed'])
            ->select('team_id', DB::raw('SUM(amount) as total_earned'), DB::raw('COUNT(id) as total_sales'))
            ->groupBy('team_id')
            ->orderByDesc('total_earned')
            ->limit(10)
            ->get()
            ->map(function ($commission) {
                return [
                    'agent_name' => $commission->team ? $commission->team->name : 'System/Unknown',
                    'total_earned' => (float) $commission->total_earned,
                    'total_sales' => $commission->total_sales,
                ];
            })->toArray();
    }

    /**
     * Get Verification Stats from Audit Logs
     *
     * @param string $startDate
     * @param string $endDate
     * @return int
     */
    public function getVerificationStats(string $startDate, string $endDate): int
    {
        return \App\Models\AuditLog::where('event', 'CERTIFICATE_VERIFIED')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
    }

    /**
     * Get Credit Exposure (Centers with highest due)
     *
     * @return array
     */
    public function getCreditExposure(): array
    {
        // First get centers that have credit enabled
        $centers = \App\Models\Center::where('credit_enabled', true)
            ->where('status', \App\Enums\CenterStatus::Approved)
            ->get();
            
        $exposure = [];
        
        foreach ($centers as $center) {
            $due = $this->getCenterCurrentDue($center->id);
            if ($due > 0) {
                $exposure[] = [
                    'center_name' => $center->name,
                    'center_code' => $center->code ?? 'N/A',
                    'due' => $due,
                    'credit_limit' => $center->credit_limit,
                    'classification' => $center->due_classification,
                    'utilization' => $center->credit_limit > 0 ? round(($due / $center->credit_limit) * 100, 2) : 0,
                ];
            }
        }
        
        // Sort by due descending
        usort($exposure, function ($a, $b) {
            return $b['due'] <=> $a['due'];
        });
        
        return array_slice($exposure, 0, 10);
    }
}
