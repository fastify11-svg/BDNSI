<?php

namespace App\Http\Controllers\Staff;

use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $staff = Auth::guard('staff')->user();

        // StaffScope automatically isolates all queries to this staff's team_id
        $today = Carbon::today();

        $target = \App\Models\TeamSalesTarget::where('team_id', $staff->id)
            ->whereDate('target_date', $today)
            ->first();

        $metrics = [
            'today_students' => Student::whereDate('created_at', $today)->count(),
            'total_students' => Student::count(),
            'approved_students' => Student::where('status', StudentStatus::Approved)->count(),
            'pending_students' => Student::whereIn('status', [StudentStatus::Pending, StudentStatus::Requested])->count(),
            'total_courses' => Subject::count(),
            'total_sessions' => Session::count(),
            'referral_code' => $staff->referral_code,
            'referral_link' => url('/?ref=' . $staff->referral_code),
            'target_students' => $target ? $target->student_target : 0,
            'target_b2b' => $target ? $target->b2b_certificate_target : 0,
        ];

        // Recent 8 student registrations
        $recentStudents = Student::with(['subject', 'session'])
            ->latest()
            ->take(8)
            ->get();

        // Top courses by student enrollment under this staff
        $topCourses = Subject::withCount('students')
            ->orderBy('students_count', 'desc')
            ->take(5)
            ->get(['id', 'name', 'code', 'rate']);

        // Monthly registrations for current staff (last 6 months)
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $monthlyTrends = Student::selectRaw("DATE_FORMAT(created_at, '%b %Y') as month_name, DATE_FORMAT(created_at, '%Y-%m') as month_key, COUNT(*) as total")
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('month_name', 'month_key')
            ->orderBy('month_key', 'ASC')
            ->get();

        return Inertia::render('Staff/Dashboard', [
            'staff' => $staff,
            'metrics' => $metrics,
            'recentStudents' => $recentStudents,
            'topCourses' => $topCourses,
            'monthlyTrends' => $monthlyTrends,
        ]);
    }
}
