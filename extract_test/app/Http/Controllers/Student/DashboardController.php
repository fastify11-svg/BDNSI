<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $studentId = Auth::guard('student')->id();

        $student = Student::withoutGlobalScopes()
            ->with(['center', 'subject', 'session', 'result', 'semesterResults'])
            ->findOrFail($studentId);

        // Fetch recent active notices
        $notices = Notice::where('is_active', true)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'result' => $student->result,
            'semesterResults' => $student->semesterResults,
            'notices' => $notices,
        ]);
    }
}
