<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Center;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Reserved for admin dashboard middleware.
    }

    public function index()
    {
        // These operational KPIs must reflect the canonical tables immediately after
        // admin mutations. Long-lived cache entries previously made the dashboard
        // disagree with the Center/Student directories for up to an hour.
        $cards = collect([
            'Total Student ' => [
                'value' => Student::count(),
                'url' => route('admin.student.index'),
            ],
            'Total Approved Student ' => [
                'value' => Student::where('status', StudentStatus::Approved)->count(),
                'url' => route('admin.student.index'),
            ],
            'Total Pending Student ' => [
                'value' => Student::where('status', StudentStatus::Pending)->count(),
                'url' => route('admin.student.index'),
            ],
            'Total Centers ' => [
                'value' => Center::count(),
                'url' => route('admin.center.index'),
            ],
            'Total Revenue' => [
                'value' => \App\Models\Order::whereIn('status', [
                    \App\Models\Order::STATUS_PAID,
                    \App\Models\Order::STATUS_PARTIALLY_PAID,
                ])->sum('paid_amount'),
                'url' => '#',
            ],
            'Total Outstanding Dues' => [
                'value' => Center::sum('current_due'),
                'url' => '#',
            ],
        ]);

        $adminList = Admin::all();

        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $monthlyRegistrations = Student::select(
            DB::raw("DATE_FORMAT(created_at, '%b %Y') as month_name"),
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key"),
            DB::raw('COUNT(*) as total')
        )
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('month_name', 'month_key')
            ->orderBy('month_key', 'ASC')
            ->get();

        $statusBreakdown = Student::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->status?->value == StudentStatus::Approved ? 'Approved' : ($item->status?->value == StudentStatus::Pending ? 'Pending' : 'Other'),
                    'value' => $item->total,
                ];
            });

        $topCenters = DB::table('students')
            ->join('centers', 'students.center_id', '=', 'centers.id')
            ->select('centers.name as center_name', DB::raw('COUNT(students.id) as total_students'))
            ->groupBy('centers.id', 'centers.name')
            ->orderBy('total_students', 'DESC')
            ->limit(5)
            ->get();

        $thirtyDaysAgo = now()->subDays(30);
        $recentRevenue = \App\Models\Order::where('created_at', '>=', $thirtyDaysAgo)->sum('paid_amount');

        return Inertia::render('Admin/Dashboard', [
            'cards' => $cards,
            'adminList' => $adminList,
            'analytics' => [
                'monthlyRegistrations' => $monthlyRegistrations,
                'statusBreakdown' => $statusBreakdown,
                'topCenters' => $topCenters,
                'recentRevenue' => $recentRevenue,
            ],
        ]);
    }

    public function userCreate(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:admins'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->success('Successfully Created');
    }
}
