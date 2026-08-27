<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseType;
use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiplomaController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['center', 'subject', 'result'])
            ->where('course_type', CourseType::Diploma)
            ->where('status', StudentStatus::Approved)
            ->whereHas('result');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('roll', 'LIKE', '%' . $search . '%')
                    ->orWhere('registration', 'LIKE', '%' . $search . '%');
            });
        }

        $students = $query->latest()->paginate(20)->appends($request->query());

        return Inertia::render('Admin/Diploma/Index', [
            'students' => $students,
            'filters' => $request->only(['search'])
        ]);
    }

    public function issue(Request $request, $id)
    {
        $request->validate([
            'diploma_serial' => 'required|string|unique:results,certificate',
        ]);

        $student = Student::findOrFail($id);

        if ($student->result) {
            $student->result->certificate = $request->diploma_serial;
            $student->result->save();
        }

        return redirect()->back()->with('success', 'Diploma successfully issued with Serial No: ' . $request->diploma_serial);
    }
}
