<?php

namespace App\Http\Controllers;

use App\Enums\CourseType;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Enums\SessionStatus;
use App\Enums\StudentStatus;
use App\Jobs\SendStudentSmsJob;
use App\Models\District;
use App\Models\Division;
use App\Models\Result;
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
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Student::hide()->select(['id', 'center_id', 'session_id', 'subject_id', 'name', 'status', 'roll'])
                ->own()
                ->with(['session', 'subject']))
                ->addColumn('admit', function ($admit) {
                    return '<a   style="background-color:green; padding:3px; border-redius:4px 4px 4px 4px; color:white"   target="_blank"   target="_blank" href="'.route('student.show', [$admit->id, 'admit' => 'admit']).'">'.'Admit'.'</a>';
                })
                ->addColumn('registration', function ($registration) {
                    $registrationLink = '<a style="background-color:green; padding:3px; border-radius:4px; color:white" target="_blank" href="'
                        .route('student.show', [$registration->id, 'registration' => 'registration'])
                        .'">Registration</a>';

                    $idCardLink = '<a style="background-color:green; padding:3px; border-radius:4px; color:white" target="_blank" href="'
                        .route('student.show', [$registration->id, 'idcard' => 'idcard'])
                        .'">Id Card</a>';

                    return $registrationLink.' '.$idCardLink;
                })
                ->addColumn('result', function ($result) {
                    return '<a  style="background-color:green; padding:3px; border-redius:4px 4px 4px 4px; color:white"   target="_blank"       href="'.route('result', ['roll' => $result->roll]).'">'.'Result'.'</a>';
                })
                ->rawColumns(['admit', 'registration', 'result'])
                ->toJson();
        }

        $query = Student::hide()->own()->with(['session', 'subject', 'result']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%'.$search.'%')
                    ->orWhere('roll', 'LIKE', '%'.$search.'%')
                    ->orWhere('registration', 'LIKE', '%'.$search.'%')
                    ->orWhere('phone', 'LIKE', '%'.$search.'%');
            });
        }

        $students = $query->latest()->paginate(25)->withQueryString();

        return Inertia::render('Center/Student/Index', [
            'students' => $students,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Center/Student/Create', [
            'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
            'subjects' => Subject::select(['id', 'name'])->get(),
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
            'name' => 'required|string',
            'fathers_name' => 'required|string',
            'mothers_name' => 'required|string',
            'date_of_birth' => 'required',
            'gender' => 'required',
            'religion' => 'required',
            'present_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'passport' => 'nullable|string',
            'phone' => 'required|string',
            'session_id' => 'required|exists:sessions,id',
            'subject_id' => 'required|exists:subjects,id',
            'course_duration' => 'nullable',
            'picture' => 'nullable',
            'course_type' => 'nullable',
        ]);

        $session = Session::find($validated['session_id']);

        $validated['present_address'] = $validated['present_address'] ?? 'Dhaka, Bangladesh';
        $validated['permanent_address'] = $validated['permanent_address'] ?? 'Dhaka, Bangladesh';
        $validated['course_type'] = $session ? $session->course_type : CourseType::Regular;
        $validated['course_duration'] = $session ? $session->course_duration_string : null;
        if ($session) {
            $validated['exam_date'] = $session->exam_date;
            $validated['result_publised'] = $session->result_published_date;
        }
        $validated['roll'] = $validated['roll'] ?? Student::getLastFreeRoll();
        $validated['registration'] = $validated['registration'] ?? Student::getLastFreeRegistration();
        $validated['center_id'] = Auth::user()->center_id ?? 1;
        $validated['status'] = StudentStatus::Pending;
        $student = Student::create($validated);
        $message = 'Congratulations!! '.$student->name.', You have successfully filled the application form for  '
            .(Auth::user()->center->name ?? '').' Technician '
            .($student->subject->name ?? '').' under  '.config('site.setting.name').' Your Roll No: '
            .$student->roll.' and Registration No: '.$student->registration.'. Thanks for staying with National '.config('site.setting.name');
        SendStudentSmsJob::dispatch($student->phone, $message);

        return redirect()->route('student.index')->with('success', 'Student Created successfully');
    }

    public function show(Request $request, Student $student)
    {
        abort_if(
            Auth::user()->center_id != $student->center_id,
            403
        );
        if ($request->admit == 'admit') {

            return view('student.admit', [
                'student' => $student,
            ]);
        }

        if ($request->registration == 'registration') {

            return view('student.registration', [
                'student' => $student,
            ]);
        }
        if ($request->idcard == 'idcard') {

            return view('student.idcard', [
                'student' => $student,
            ]);
        }

        return view('student.show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        abort_if(
            Auth::user()->center_id != $student->center_id,
            403
        );

        if ($student->status->isNot(StudentStatus::Pending())) {
            return response()->error('Can\'t update student which is not in pending status');
        }

        return view('student.edit', [
            'student' => $student,
            'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
            'subjects' => Subject::select(['id', 'name'])->get(),
            'divisions' => Division::get(),
            'districts_keys' => District::get()->mapWithKeys(function ($district) {
                return [
                    $district->id => [
                        'id' => $district->id,
                        'division_id' => $district->division_id,
                        'name' => $district->name,
                    ],
                ];
            }),

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

    public function update(Request $request, Student $student)
    {
        abort_if(
            Auth::user()->center_id != $student->center_id,
            403
        );

        if ($student->status->isNot(StudentStatus::Pending())) {
            return response()->error('Can\'t delete student which is not in pending status');
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'fathers_name' => 'required|string',
            'mothers_name' => 'required|string',
            'date_of_birth' => 'nullable',
            'gender' => 'required|numeric|enum_value:'.Gender::class.',false',
            'religion' => 'required|numeric|enum_value:'.Religion::class.',false',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'passport' => 'nullable|string',
            'phone' => 'nullable|string|min:11|max:11',
            'session_id' => 'required|exists:sessions,id',
            'subject_id' => 'required|exists:subjects,id',
            'course_duration' => 'nullable',
            'qualification' => 'required',
            'picture' => 'nullable|image',

        ]);

        $session = Session::find($validated['session_id']);
        if ($session) {
            $validated['course_type'] = $session->course_type;
            $validated['course_duration'] = $session->course_duration_string;
            $validated['exam_date'] = $session->exam_date;
            $validated['result_publised'] = $session->result_published_date;
        }

        return response()->report($student->update($validated), 'Student Updated successfully');
    }

    public function destroy(Student $student)
    {
        abort_if(
            Auth::user()->center_id != $student->center_id,
            403
        );

        if ($student->status->isNot(StudentStatus::Pending())) {
            return response()->error('Can\'t delete student which is not in pending status');
        }

        DB::transaction(function () use ($student) {
            \App\Models\Result::where('student_id', $student->id)->delete();
            \App\Models\Payment::where('student_id', $student->id)->delete();
            \App\Models\Transaction::where('payable_type', 'App\\Models\\Student')
                ->where('payable_id', $student->id)->delete();
            $student->delete();
        });

        return response()->report(true, 'Student Deleted successfully');
    }
}
