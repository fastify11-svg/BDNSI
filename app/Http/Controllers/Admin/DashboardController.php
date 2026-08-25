<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Center;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        /*
         * Uncomment the line below if you want to use verified middleware
         */
        // $this->middleware('verified:admin.verification.notice');
    }

    public function index()
    {
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
                'value' => \App\Models\Order::where('status', 'Paid')->orWhere('status', 'Partially Paid')->sum('paid_amount'),
                'url' => '#',
            ],
            'Total Outstanding Dues' => [
                'value' => \App\Models\Center::sum('current_due'),
                'url' => '#',
            ]
        ]);

        $adminList = Admin::all();

        // Analytics Data

        // 1. Monthly Registrations (Last 6 Months)
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

        // 2. Student Status Breakdown
        $statusBreakdown = Student::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->status?->value == StudentStatus::Approved ? 'Approved' : ($item->status?->value == StudentStatus::Pending ? 'Pending' : 'Other'),
                    'value' => $item->total,
                ];
            });

        // 3. Top Centers
        $topCenters = DB::table('students')
            ->join('centers', 'students.center_id', '=', 'centers.id')
            ->select('centers.name as center_name', DB::raw('COUNT(students.id) as total_students'))
            ->groupBy('centers.id', 'centers.name')
            ->orderBy('total_students', 'DESC')
            ->limit(5)
            ->get();
            
        // 4. Financial Health (Last 30 Days Revenue)
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

        $user = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->success('Successfully Created');

    }
}
