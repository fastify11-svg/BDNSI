<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CenterLedger;
use App\Models\Order;
use App\Models\Student;
use App\Models\Commission;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display a comprehensive advanced reporting dashboard.
     */
    public function index(Request $request, \App\Services\AnalyticsService $analyticsService)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->toDateString());

        // 1. Revenue & Collections. Cast decimal aggregates so the Inertia contract
        // is stable across database drivers (MySQL PDO returns DECIMAL sums as strings).
        $totalRevenue = (float) CenterLedger::whereBetween('created_at', [$startDate, $endDate])
                                     ->where('type', 'credit')
                                     ->sum('amount');
                                     
        // 2. Pending Dues (Global)
        // Fixed: Use AnalyticsService which correctly calculates Debit - Credit.
        $totalPendingDues = $analyticsService->getCenterCurrentDue(null);

        // 3. Center Performance (Registrations & Sales)
        $centerPerformance = Student::with('center')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('center_id, count(id) as total_students')
            ->groupBy('center_id')
            ->orderByDesc('total_students')
            ->limit(10)
            ->get()
            ->map(function ($stat) {
                return [
                    'center_name' => $stat->center->center_name ?? 'Unknown',
                    'total_students' => $stat->total_students
                ];
            });

        // 4. Staff Commissions
        $totalCommissions = (float) Commission::whereBetween('created_at', [$startDate, $endDate])
                                      ->sum('amount');

        // Phase N Enhancements
        // Revenue vs Collection Chart Data (Daily)
        $revenueData = collect($analyticsService->getRevenueOverTime($startDate, $endDate));
        $collectionData = collect($analyticsService->getCollectionOverTime($startDate, $endDate));
        
        // Merge them by date
        $allDates = $revenueData->pluck('date')->merge($collectionData->pluck('date'))->unique()->sort()->values();
        $revenueChartData = $allDates->map(function ($date) use ($revenueData, $collectionData) {
            $rev = $revenueData->firstWhere('date', $date)['revenue'] ?? 0;
            $col = $collectionData->firstWhere('date', $date)['collection'] ?? 0;
            return [
                'date' => $date,
                'revenue' => $rev,
                'collection' => $col,
            ];
        });

        // Product/Course Demand
        $productDemand = $analyticsService->getCourseDemand(null)->take(10);

        // Top Sales Agents
        $topAgents = $analyticsService->getTopSalesAgents();

        // Credit Exposure
        $creditExposure = $analyticsService->getCreditExposure();

        // Operational Stats
        $certificateIssuances = $analyticsService->getCertificateIssuanceCount(null);
        $verifications = $analyticsService->getVerificationStats($startDate, $endDate);

        return Inertia::render('Admin/Reports/Index', [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_dues' => max(0, $totalPendingDues),
                'total_commissions' => $totalCommissions,
                'total_issuances' => $certificateIssuances,
                'total_verifications' => $verifications,
            ],
            'revenue_chart_data' => $revenueChartData,
            'center_performance' => $centerPerformance,
            'product_demand' => $productDemand,
            'top_agents' => $topAgents,
            'credit_exposure' => $creditExposure,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }
}
