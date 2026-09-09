<?php

namespace App\Http\Controllers\Staff;

use App\Enums\CourseType;
use App\Enums\SessionStatus;
use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Jobs\SendStudentSmsJob;
use App\Lib\Image;
use App\Models\Center;
use App\Models\District;
use App\Models\Division;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Upazila;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['subject', 'session', 'center', 'result'])->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('roll', 'like', "%{$search}%")
                    ->orWhere('registration', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $students = $query->paginate(20)->withQueryString();

        return Inertia::render('Staff/Student/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $staffId = Auth::guard('staff')->id();

        // Dynamically populate Course and Session dropdowns ONLY with this staff's created data
        // StaffScope automatically ensures Subject::all() and Session::all() only return this staff's items
        $subjects = Subject::select(['id', 'name', 'code', 'rate', 'duration'])->get();
        $sessions = Session::select(['id', 'name', 'duration', 'exam_date', 'result_published_date'])
            ->where('status', SessionStatus::Active)
            ->get();

        // Centers assigned to this staff or general centers
        $centers = Center::where('team_id', $staffId)
            ->orWhereNull('team_id')
            ->select(['id', 'name', 'code'])
            ->get();

        return Inertia::render('Staff/Student/Create', [
            'subjects' => $subjects,
            'sessions' => $sessions,
            'centers' => $centers,
            'divisions' => Division::get(),
            'districts' => District::get(),
            'upazilas' => Upazila::get()->mapWithKeys(function ($upazila) {
                return [
                    $upazila->id => [
                        'id' => $upazila->id,
                        'district_id' => $upazila->district_id,
                        'name' => $upazila->name,
                    ],
                ];
            })->toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fathers_name' => 'required|string|max:255',
            'mothers_name' => 'required|string|max:255',
            'date_of_birth' => 'required',
            'gender' => 'required',
            'religion' => 'required',
            'present_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'passport' => 'nullable|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'session_id' => 'required|exists:sessions,id',
            'subject_id' => 'required|exists:subjects,id',
            'center_id' => 'nullable|exists:centers,id',
            'picture' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $session = Session::find($validated['session_id']);
        $subject = Subject::find($validated['subject_id']);

        $validated['present_address'] = $validated['present_address'] ?? 'Dhaka, Bangladesh';
        $validated['permanent_address'] = $validated['permanent_address'] ?? 'Dhaka, Bangladesh';
        $validated['course_type'] = $session ? $session->course_type : CourseType::Regular;
        $validated['course_duration'] = $session ? $session->course_duration_string : ($subject->duration ?? null);
        
        if ($session) {
            $validated['exam_date'] = $session->exam_date;
            $validated['result_publised'] = $session->result_published_date;
        }

        $validated['roll'] = Student::getLastFreeRoll();
        $validated['registration'] = Student::getLastFreeRegistration();
        $validated['team_id'] = Auth::guard('staff')->id();
        $validated['center_id'] = $validated['center_id'] ?? (Center::first()->id ?? 1);
        $validated['status'] = StudentStatus::Pending;

        if ($request->hasFile('picture')) {
            $validated['picture'] = Image::store('picture', 'students');
        }

        $student = Student::create($validated);

        // Async SMS dispatch
        $message = 'Welcome ' . $student->name . '! Your application has been registered under BDNSI. Roll: ' . $student->roll . ', Reg: ' . $student->registration;
        SendStudentSmsJob::dispatch($student->phone, $message);

        return redirect()->route('staff.student.index')->with('success', 'Student enrolled successfully.');
    }

    public function show(Student $student)
    {
        $student->load(['subject', 'session', 'center', 'result', 'semesterResults']);

        return Inertia::render('Staff/Student/Show', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fathers_name' => 'required|string|max:255',
            'mothers_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable',
            'gender' => 'required',
            'religion' => 'required',
            'present_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'phone' => 'nullable|string',
            'session_id' => 'required|exists:sessions,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Student record updated successfully.');
    }

    public function destroy(Student $student)
    {
        DB::transaction(function () use ($student) {
            \App\Models\Result::where('student_id', $student->id)->delete();
            \App\Models\SemesterResult::where('student_id', $student->id)->delete();
            \App\Models\Payment::where('student_id', $student->id)->delete();
            \App\Models\Transaction::where('payable_type', 'App\\Models\\Student')
                ->where('payable_id', $student->id)->delete();
            $student->delete();
        });

        return redirect()->route('staff.student.index')->with('success', 'Student record removed.');
    }
}
