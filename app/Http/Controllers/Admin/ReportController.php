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
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->toDateString());

        // 1. Revenue & Collections
        $totalRevenue = CenterLedger::whereBetween('created_at', [$startDate, $endDate])
                                     ->where('transaction_type', 'credit')
                                     ->sum('amount');
                                     
        // 2. Pending Dues (Global)
        $totalPendingDues = CenterLedger::sum('amount') * -1; // Assuming negative balance is due

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
        $totalCommissions = Commission::whereBetween('created_at', [$startDate, $endDate])
                                      ->sum('amount');

        return Inertia::render('Admin/Reports/Index', [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_dues' => max(0, $totalPendingDues),
                'total_commissions' => $totalCommissions,
            ],
            'center_performance' => $centerPerformance,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }
}
