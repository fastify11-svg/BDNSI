<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['center', 'subject', 'session'])
            ->where('status', StudentStatus::Pending);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('roll', 'LIKE', '%' . $search . '%')
                    ->orWhere('registration', 'LIKE', '%' . $search . '%');
            });
        }

        $students = $query->latest()->paginate(20)->appends($request->query());

        return Inertia::render('Admin/RegistrationReview/Index', [
            'students' => $students,
            'filters' => $request->only(['search'])
        ]);
    }

    public function approve(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id'
        ]);

        Student::whereIn('id', $request->student_ids)
            ->update(['status' => StudentStatus::Approved]);

        return redirect()->back()->with('success', count($request->student_ids) . ' Students approved successfully.');
    }
}
