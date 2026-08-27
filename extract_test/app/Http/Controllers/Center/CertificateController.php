<?php

namespace App\Http\Controllers\Center;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use App\Models\Student;
use App\Policies\AcademicAccessPolicy;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class CertificateController extends Controller
{
    private function renderDynamicTemplate(string $type, Student $student, string $fallbackView)
    {
        $template = DocumentTemplate::where('type', $type)->where('status', 1)->first();
        if ($template) {
            if ($template->is_builtin) {
                $view = $template->blade_view ?: $fallbackView;
                return view($view, compact('student'));
            }

            $mappedFields = $template->fields->map(function ($field) use ($student) {
                $val = '';
                if ($field->variable_key == 'student_name' || $field->variable_key == 'name') {
                    $val = $student->name;
                } elseif ($field->variable_key == 'fathers_name') {
                    $val = $student->fathers_name;
                } elseif ($field->variable_key == 'mothers_name') {
                    $val = $student->mothers_name;
                } elseif ($field->variable_key == 'student_roll' || $field->variable_key == 'roll') {
                    $val = $student->roll;
                } elseif ($field->variable_key == 'student_registration' || $field->variable_key == 'registration') {
                    $val = $student->registration;
                } elseif ($field->variable_key == 'serial_no') {
                    $val = \App\Lib\Helper::certificateSerialNumber($student->id);
                } elseif ($field->variable_key == 'session_name') {
                    $val = optional($student->session)->name;
                } elseif ($field->variable_key == 'course_name') {
                    $val = optional($student->subject)->name;
                } elseif ($field->variable_key == 'course_duration') {
                    $val = $student->course_duration;
                } elseif ($field->variable_key == 'center_name') {
                    $val = optional($student->center)->name;
                } elseif ($field->variable_key == 'center_code') {
                    $val = optional($student->center)->code;
                } elseif ($field->variable_key == 'exam_date') {
                    $val = $student->exam_date ? Carbon::parse($student->exam_date)->format('j-F-Y') : '';
                } elseif ($field->variable_key == 'result_published_date') {
                    $val = $student->result_publised ? Carbon::parse($student->result_publised)->format('j-F-Y') : '';
                } elseif ($field->variable_key == 'cgpa') {
                    $val = $student->t_written_gpa() ? number_format($student->t_written_gpa(), 2) : '';
                } elseif ($field->variable_key == 'grade') {
                    $val = $student->t_written();
                } elseif ($field->variable_key == 'student_phone') {
                    $val = $student->phone;
                } elseif ($field->variable_key == 'student_image') {
                    $val = $student->picture;
                } elseif ($field->variable_key == 'qr_code') {
                    $val = base64_encode(QrCode::size(100)->generate(route('result', ['roll' => $student->roll])));
                }

                return ['field' => $field, 'value' => $val, 'type' => in_array($field->variable_key, ['qr_code', 'student_image']) ? ($field->variable_key === 'qr_code' ? 'qrcode' : 'image') : 'text'];
            });

            return view('admin.document_template.preview', compact('template', 'mappedFields'));
        }

        return view($fallbackView, compact('student'));
    }

    public function index(Request $request)
    {
        $center = Auth::user()->center;
        
        $query = Student::with(['subject:id,name', 'session:id,name', 'result'])
            ->where('center_id', $center->id)
            ->whereNotNull('result_publised'); // Only students with published results can get certificates

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('roll', 'LIKE', "%$search%")
                  ->orWhere('registration', 'LIKE', "%$search%");
            });
        }

        $students = $query->orderBy('id', 'desc')->paginate(20)->appends($request->query());
        
        $policy = new AcademicAccessPolicy();
        
        // Evaluate policy for each student
        $students->getCollection()->transform(function ($student) use ($policy, $center) {
            $student->is_cleared = $policy->accessCertificate($center, $student);
            return $student;
        });

        return Inertia::render('Center/Certificate/Index', [
            'students' => $students,
            'filters' => $request->only('search')
        ]);
    }

    public function show(Request $request, Student $student)
    {
        $center = Auth::user()->center;

        if ($student->center_id !== $center->id) {
            abort(403, 'Unauthorized access.');
        }

        $policy = new AcademicAccessPolicy();
        if (!$policy->accessCertificate($center, $student)) {
            abort(403, 'Certificate access blocked due to unpaid balance.');
        }

        if ($request->original == 'original') {
            return $this->renderDynamicTemplate('original_certificate', $student, 'admin.student.orginalCertificate');
        }

        return $this->renderDynamicTemplate('certificate', $student, 'admin.student.certificate2');
    }
}
