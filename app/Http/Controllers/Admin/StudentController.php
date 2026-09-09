<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BloodGroup;
use App\Enums\CenterStatus;
use App\Enums\CourseType;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Enums\SessionStatus;
use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Jobs\SendStudentSmsJob;
use App\Lib\Helper;
use App\Models\Center;
use App\Models\District;
use App\Models\Division;
use App\Models\DocumentTemplate;
use App\Models\Result;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Upazila;
use App\Traits\ChecksPermission;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class StudentController extends Controller
{
    private function renderDynamicTemplate(string $type, Student $student, string $fallbackView)
    {
        $template = DocumentTemplate::where('type', $type)->where('status', 1)->first();
        if ($template) {
            if ($template->is_builtin) {
                // For built-in templates, use the mapped blade_view or fallback to the hardcoded one
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
                    $val = Helper::certificateSerialNumber($student->id);
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

    use ChecksPermission;

    protected $permissionPrefix = 'student';

    protected $skipActions = ['admit', 'certificate', 'certificateWithoutBackground', 'exportCsv', 'importCsv', 'registrationForm'];

    public function admit(int $id)
    {
        $student = Student::where('id', $id)->firstOrFail();

        return $this->renderDynamicTemplate('admit_card', $student, 'admin.student.admitCard');
    }

    public function certificate(Request $request, int $id)
    {
        $student = Student::where('id', $id)->firstOrFail();
        if ($request->original == 'original') {
            return $this->renderDynamicTemplate('original_certificate', $student, 'admin.student.orginalCertificate');
        }

        return $this->renderDynamicTemplate('certificate', $student, 'admin.student.certificate2');
    }

    public function registrationForm(int $id)
    {
        $student = Student::where('id', $id)->firstOrFail();
        return $this->renderDynamicTemplate('registration_form', $student, 'admin.student.registrationForm');
    }

    public function certificateWithoutBackground(int $id)
    {
        $student = Student::where('id', $id)->firstOrFail();

        return $this->renderDynamicTemplate('certificate', $student, 'admin.student.certificate');
    }

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            $activeTemplates = DocumentTemplate::where('status', 1)->get();

            return datatables(Student::with('center:id,code', 'subject:id,name', 'result'))
                ->editColumn('registration', function ($registration) use ($activeTemplates) {
                    $regBtn = '<a style="background-color:#0F5233; color:#ffffff; padding:3px 8px; border-radius:9999px; font-size:11px; font-weight:700; text-decoration:none; display:inline-block;" target="_blank" href="'.route('admin.student.show', [$registration->id, 'registration' => 'registration']).'">'.e($registration->registration ?: 'N/A').'</a>';
                    $transcriptBtn = '<a style="background-color:#EBF8FF; color:#1D4ED8; border:1px solid #BFDBFE; padding:3px 8px; border-radius:9999px; font-size:11px; font-weight:700; text-decoration:none; display:inline-block;" target="_blank" href="'.route('admin.student.show', [$registration->id, 'transcript' => 'transcript']).'">Transcript</a>';

                    $dynamicBtns = '';
                    $colors = [
                        ['bg' => '#FAF5FF', 'text' => '#6D28D9', 'border' => '#E9D8FD'],
                        ['bg' => '#F0FFF4', 'text' => '#15803D', 'border' => '#BBF7D0'],
                        ['bg' => '#EEF2FF', 'text' => '#4338CA', 'border' => '#E0E7FF'],
                        ['bg' => '#ECFDF5', 'text' => '#047857', 'border' => '#D1FAE5'],
                        ['bg' => '#FFFBEB', 'text' => '#B45309', 'border' => '#FEF3C7'],
                    ];

                    foreach ($activeTemplates as $index => $template) {
                        $color = $colors[$index % count($colors)];
                        $url = route('admin.document-templates.generate', ['template_id' => $template->id, 'student_id' => $registration->id]);
                        $dynamicBtns .= '<a style="background-color:'.$color['bg'].'; color:'.$color['text'].'; border:1px solid '.$color['border'].'; padding:3px 8px; border-radius:9999px; font-size:11px; font-weight:700; text-decoration:none; display:inline-block;" target="_blank" href="'.$url.'">'.e($template->name).'</a>';
                    }

                    return '<div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; max-width:320px;">'.$regBtn.$transcriptBtn.$dynamicBtns.'</div>';
                })
                ->editColumn('roll', function ($roll) {
                    return '<a style="background-color:#BE123C; color:#ffffff; padding:3px 10px; border-radius:9999px; font-size:11px; font-weight:700; text-decoration:none; display:inline-block;" target="_blank" href="'.route('admin.student.admit', [$roll->id, 'admit' => 'admit']).'">'.e($roll->roll ?: 'N/A').'</a>';
                })
                ->addColumn('student_result', function ($student_result) {
                    return '<a target="_blank" href="'.route('admin.result.show', $student_result->id ?? '').'">'.($student_result->result()->count() == 1 ? 'Result' : 'N/A').'</a>';

                })
                ->rawColumns(['registration', 'roll', 'student_result', 'certificate'])
                ->toJson();
        }

        $query = Student::with(['center:id,code,name', 'subject:id,name', 'result', 'session:id,name']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%'.$search.'%')
                    ->orWhere('roll', 'LIKE', '%'.$search.'%')
                    ->orWhere('registration', 'LIKE', '%'.$search.'%')
                    ->orWhere('phone', 'LIKE', '%'.$search.'%');
            });
        }

        if ($request->center_id) {
            $query->where('center_id', $request->center_id);
        }

        if ($request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->session_id) {
            $query->where('session_id', $request->session_id);
        }

        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('course_type') && $request->course_type !== null && $request->course_type !== '') {
            $query->where('course_type', $request->course_type);
        }

        $students = $query->latest()->paginate(25)->appends($request->query());

        $centers = Center::select(['id', 'code', 'name'])->whereStatus(CenterStatus::Approved)->get();
        if ($centers->isEmpty()) {
            $centers = Center::select(['id', 'code', 'name'])->get();
        }
        $subjects = Subject::select(['id', 'name'])->orderBy('name', 'asc')->get();
        $sessions = Session::select(['id', 'name'])->get();

        // Analytics Logic - Optimized into a single query to prevent excessive DB hits
        $analyticsData = Student::selectRaw("
            count(id) as total,
            sum(case when status = ? then 1 else 0 end) as active,
            sum(case when gender = ? then 1 else 0 end) as male,
            sum(case when gender = ? then 1 else 0 end) as female,
            sum(case when course_type = ? then 1 else 0 end) as regular,
            sum(case when course_type = ? then 1 else 0 end) as short,
            sum(case when course_type = ? then 1 else 0 end) as diploma,
            sum(due_amount) as due,
            sum(paid_amount) as paid
        ", [
            StudentStatus::Approved,
            Gender::Male,
            Gender::Female,
            CourseType::Regular,
            CourseType::Short_Course,
            CourseType::Diploma
        ])->first();

        $analytics = [
            'total' => $analyticsData->total ?? 0,
            'active' => $analyticsData->active ?? 0,
            'male' => $analyticsData->male ?? 0,
            'female' => $analyticsData->female ?? 0,
            'regular' => $analyticsData->regular ?? 0,
            'short' => $analyticsData->short ?? 0,
            'diploma' => $analyticsData->diploma ?? 0,
            'due' => $analyticsData->due ?? 0,
            'paid' => $analyticsData->paid ?? 0,
        ];

        return Inertia::render('Admin/Student/Index', [
            'students' => $students,
            'centers' => $centers,
            'subjects' => $subjects,
            'sessions' => $sessions,
            'filters' => $request->only(['search', 'center_id', 'subject_id', 'session_id', 'status', 'course_type']),
            'analytics' => $analytics,
        ]);
    }

    public function exportCsv(Request $request)
    {
        $query = Student::with(['center', 'subject', 'session']);

        // Apply filters exactly like index
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%'.$search.'%')
                    ->orWhere('roll', 'LIKE', '%'.$search.'%')
                    ->orWhere('registration', 'LIKE', '%'.$search.'%')
                    ->orWhere('phone', 'LIKE', '%'.$search.'%');
            });
        }
        if ($request->center_id) {
            $query->where('center_id', $request->center_id);
        }
        if ($request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->session_id) {
            $query->where('session_id', $request->session_id);
        }
        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $query->where('status', $request->status);
        }
        if ($request->has('course_type') && $request->course_type !== null && $request->course_type !== '') {
            $query->where('course_type', $request->course_type);
        }

        $students = $query->with(['center', 'session', 'subject'])->get();

        $filename = 'students_'.date('Y_m_d_His').'.csv';
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$filename",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $columns = [
            'ID', 'Name', 'Roll', 'Registration', 'Center', 'Session', 'Course',
            'Phone', 'Gender', 'Status', 'Due Amount', 'Paid Amount',
        ];

        $callback = function () use ($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($students as $student) {
                $gender = $student->gender ? $student->gender->key : '';
                $status = $student->status ? $student->status->key : '';
                $center = $student->center->name ?? '';
                $session = $student->session->name ?? '';
                $subject = $student->subject->name ?? '';

                $row = [
                    $student->id,
                    $student->name,
                    $student->roll,
                    $student->registration,
                    $center,
                    $session,
                    $subject,
                    $student->phone,
                    $gender,
                    $status,
                    $student->due_amount ?? 0,
                    $student->paid_amount ?? 0,
                ];
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:5120',
            'center_id' => 'required|exists:centers,id',
            'session_id' => 'required|exists:sessions,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $file = $request->file('file');

        $centerId = $request->center_id;
        $sessionId = $request->session_id;
        $subjectId = $request->subject_id;

        $session = Session::find($sessionId);
        $courseType = $session ? $session->course_type : CourseType::Regular;
        $courseDuration = $session ? $session->course_duration_string : '6 Months';
        $examDate = $session ? $session->exam_date : null;
        $resultPublished = $session ? $session->result_published_date : null;

        $handle = fopen($file->path(), 'r');
        $header = fgetcsv($handle); // skip header

        $successCount = 0;

        DB::beginTransaction();
        try {
            while (($row = fgetcsv($handle)) !== false) {
                // Expected CSV format:
                // [0] Name, [1] Father's Name, [2] Mother's Name, [3] Phone, [4] Gender (Male/Female), [5] Date of Birth, [6] Roll (optional), [7] Registration (optional)

                if (empty($row[0])) {
                    continue;
                } // Name is required

                $name = trim($row[0]);
                $fathers_name = isset($row[1]) ? trim($row[1]) : '';
                $mothers_name = isset($row[2]) ? trim($row[2]) : '';
                $phone = isset($row[3]) ? trim($row[3]) : '';

                $genderStr = isset($row[4]) ? strtolower(trim($row[4])) : '';
                $gender = Gender::Male;
                if ($genderStr == 'female' || $genderStr == 'f') {
                    $gender = Gender::Female;
                }

                $dob = isset($row[5]) ? trim($row[5]) : null;

                $roll = isset($row[6]) && ! empty(trim($row[6])) ? trim($row[6]) : Student::getLastFreeRoll();
                $registration = isset($row[7]) && ! empty(trim($row[7])) ? trim($row[7]) : Student::getLastFreeRegistration();

                Student::create([
                    'center_id' => $centerId,
                    'session_id' => $sessionId,
                    'subject_id' => $subjectId,
                    'course_type' => $courseType,
                    'course_duration' => $courseDuration,
                    'name' => $name,
                    'fathers_name' => $fathers_name,
                    'mothers_name' => $mothers_name,
                    'phone' => $phone,
                    'gender' => $gender,
                    'date_of_birth' => $dob,
                    'roll' => $roll,
                    'registration' => $registration,
                    'status' => StudentStatus::Approved,
                    'exam_date' => $examDate,
                    'result_publised' => $resultPublished,
                    'due_amount' => 0,
                    'paid_amount' => 0,
                    'religion' => Religion::Muslim,
                    'blood_group' => BloodGroup::A_Positive,
                    'present_address' => 'N/A',
                    'permanent_address' => 'N/A',
                    'qualification' => 'SSC',
                ]);

                $successCount++;
            }
            DB::commit();
            fclose($handle);

            return redirect()->back()->with('success', "$successCount students imported successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);

            return redirect()->back()->withErrors(['error' => 'Error importing CSV: '.$e->getMessage()]);
        }
    }

    public function create(Request $request)
    {
        $centers = Center::select(['id', 'code', 'name'])->whereStatus(CenterStatus::Approved)->get();
        if ($centers->isEmpty()) {
            $centers = Center::select(['id', 'code', 'name'])->get();
        }
        $sessions = Session::where('status', SessionStatus::Active)->get()->append('course_type');
        if ($sessions->isEmpty()) {
            $sessions = Session::get()->append('course_type');
        }
        $subjects = Subject::select(['id', 'name'])->get();
        $divisions = Division::get();
        $districts = District::get(['id', 'division_id', 'name']);
        $upazilas = Upazila::get(['id', 'district_id', 'name']);
        $teams = \App\Models\Team::all();
        $registration = Student::getLastFreeRegistration();
        $roll = Student::getLastFreeRoll();

        if ($request->header('X-Inertia') || ! $request->ajax()) {
            return Inertia::render('Admin/Student/Create', [
                'centers' => $centers,
                'sessions' => $sessions,
                'subjects' => $subjects,
                'divisions' => $divisions,
                'districts' => $districts,
                'upazilas' => $upazilas,
                'teams' => $teams,
                'registration' => $registration,
                'roll' => $roll,
                'genders' => Gender::getInstances(),
                'religions' => Religion::getInstances(),
                'courseTypes' => CourseType::getInstances(),
            ]);
        }

        return view('admin.student.create', compact('centers', 'sessions', 'subjects', 'divisions', 'districts', 'upazilas', 'registration', 'roll'));
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Inside StudentController@store: ' . json_encode($request->all()));
        $validated = $request->validate([
            'center_id' => 'required|exists:centers,id',
            'name' => 'required|string',
            'roll' => 'nullable|string|unique:students,roll',
            'passport' => 'nullable|string|unique:students,passport',
            'nid_or_birth' => 'nullable|string',
            'registration' => 'nullable|string|unique:students,registration',
            'fathers_name' => 'required|string',
            'mothers_name' => 'required|string',
            'date_of_birth' => 'nullable',
            'gender' => 'required|numeric|enum_value:'.Gender::class.',false',
            'religion' => 'required|numeric|enum_value:'.Religion::class.',false',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'phone' => 'required',
            'session_id' => 'required|exists:sessions,id',
            'subject_id' => 'required|exists:subjects,id',
            'course_duration' => 'required',
            'qualification' => 'required',
            'status' => 'required|numeric|enum_value:'.StudentStatus::class.',false',
            'picture' => (config('app.env') === 'testing' || config('app.env') === 'local') ? 'nullable|image' : 'required|image',
            'payment_status' => 'nullable|numeric|in:0,1',
            'course_type' => ['required', Rule::in(CourseType::asArray())],
            'team_id' => 'nullable|exists:teams,id',
        ]);

        try {
            DB::beginTransaction();

            if (!$request->hasFile('picture')) {
                unset($validated['picture']);
            }

            \Illuminate\Support\Facades\Log::info("Saving student: begin");
            $validated['roll'] = $validated['roll'] ?? Student::getLastFreeRoll();
            $validated['registration'] = $validated['registration'] ?? Student::getLastFreeRegistration();

            $session = Session::find($validated['session_id']);
            $validated['exam_date'] = $request->exam_date ?: ($session ? $session->exam_date : null);
            $validated['result_publised'] = $request->result_publised ?: ($session ? $session->result_published_date : null);

            if ($session && $session->duration) {
                $validated['course_type'] = $session->course_type;
                $validated['course_duration'] = $session->course_duration_string;
            }

            \Illuminate\Support\Facades\Log::info("Saving student: creating model");
            $student = Student::create($validated);
            \Illuminate\Support\Facades\Log::info("Saving student: model created");

            $student->load(['center', 'subject']);
            $centerName = $student->center->name ?? (Auth::user()->center->name ?? '');
            $subjectName = $student->subject->name ?? '';
            $message = 'Congratulations!! '.$student->name.', You have successfully filled the application form for  '
                .$centerName.' Technician '
                .$subjectName.' under  '.config('site.setting.name').' Your Roll No: '
                .$student->roll.' and Registration No: '.$student->registration.'. Thanks for staying with '.config('site.setting.name');
            \Illuminate\Support\Facades\Log::info("Saving student: dispatching sms");
            SendStudentSmsJob::dispatch($student->phone, $message);
            
            // --- Phase E: Registration Order Hook (Admin) ---
            $pricingService = new \App\Services\PricingService();
            $priceData = $pricingService->resolvePrice('registration', $validated['center_id']);
            $finalPrice = $priceData['final_price'];

            $order = \App\Models\Order::create([
                'center_id' => $validated['center_id'],
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total_amount' => $finalPrice,
                'discount_amount' => $priceData['discount'],
                'payable_amount' => $finalPrice,
                'paid_amount' => 0,
                'due_amount' => $finalPrice,
                'status' => \App\Models\Order::STATUS_PENDING,
            ]);

            \App\Models\OrderItem::create([
                'order_id' => $order->id,
                'itemable_id' => $student->id,
                'itemable_type' => \App\Models\Student::class,
                'product_type' => 'registration',
                'unit_price' => $finalPrice,
                'qty' => 1,
                'total' => $finalPrice,
            ]);

            if ($finalPrice > 0) {
                // Admin creation bypasses policy limits, adds to center due unconditionally
                $center = $student->center;
                if ($center) {
                    $ledgerService = new \App\Services\FinancialLedgerService();
                    $ledgerService->recordOrder($center, $order, $finalPrice, 'Student Registration Fee (Admin) - ' . $student->registration);
                }
                $student->update([
                    'payment_status' => 0,
                    'due_amount' => $finalPrice,
                ]);
            } else {
                $student->update([
                    'payment_status' => 1,
                    'paid_amount' => 0,
                    'due_amount' => 0,
                ]);
                $order->update(['status' => \App\Models\Order::STATUS_PAID]);
            }

            \Illuminate\Support\Facades\Log::info("Saving student: committing");
            DB::commit();
            \Illuminate\Support\Facades\Log::info("Saving student: done");

            if ($request->header('X-Inertia')) {
                return redirect()->route('admin.student.index')
                    ->with('success', 'Student Created successfully');
            }

            return response()->report($student, 'Student Created successfully');
        } catch (\Exception $exception) {
            DB::rollBack();

            if ($request->header('X-Inertia')) {
                return redirect()->back()
                    ->withErrors(['error' => 'Something went wrong while saving student.'])
                    ->header('Connection', 'close');
            }

            return response()->error('something went wrong')->header('Connection', 'close');
        }
    }

    public function show(Request $request, Student $student)
    {
        if ($request->registration == 'registration') {
            $student = Student::where('id', $student->id)->firstOrFail();

            return $this->renderDynamicTemplate('registration_card', $student, 'admin.student.registrationForm');
        } elseif ($request->transcript == 'transcript') {
            $student = Student::where('id', $student->id)->firstOrFail();

            return $this->renderDynamicTemplate('transcript', $student, 'admin.student.transcript');
        } elseif ($request->idcard == 'idcard') {
            $student = Student::where('id', $student->id)->firstOrFail();

            return $this->renderDynamicTemplate('id_card', $student, 'admin.student.idcard');
        } elseif ($request->cpdf == 'cpdf') {
            $student = Student::where('id', $student->id)->firstOrFail();

            return $this->renderDynamicTemplate('certificate_pdf', $student, 'admin.student.cpdf');
        } elseif ($request->orginalcpdf == 'orginalcpdf') {
            $student = Student::where('id', $student->id)->firstOrFail();

            return $this->renderDynamicTemplate('original_c_pdf', $student, 'admin.student.originalCpdf');
        } else {
            $student->load(['center', 'subject', 'session', 'result']);
            if ($request->header('X-Inertia') || ! $request->ajax()) {
                return Inertia::render('Admin/Student/Show', [
                    'student' => $student,
                ]);
            }

            return view('admin.student.show', [
                'student' => $student,
            ]);
        }
    }

    public function edit(Request $request, Student $student)
    {
        $student->load(['center', 'subject', 'session', 'result']);
        $centers = Center::select(['id', 'code', 'name'])->whereStatus(CenterStatus::Approved)->get();
        if ($centers->isEmpty()) {
            $centers = Center::select(['id', 'code', 'name'])->get();
        }
        $sessions = Session::select(['id', 'name'])->get();
        $subjects = Subject::select(['id', 'name'])->get();
        $divisions = Division::get();
        $districts = District::get(['id', 'division_id', 'name']);
        $upazilas = Upazila::get(['id', 'district_id', 'name']);
        $teams = \App\Models\Team::all();

        if ($request->header('X-Inertia') || ! $request->ajax()) {
            return Inertia::render('Admin/Student/Edit', [
                'student' => $student,
                'centers' => $centers,
                'sessions' => $sessions,
                'subjects' => $subjects,
                'divisions' => $divisions,
                'districts' => $districts,
                'upazilas' => $upazilas,
                'teams' => $teams,
                'genders' => Gender::getInstances(),
                'religions' => Religion::getInstances(),
                'courseTypes' => CourseType::getInstances(),
                'statuses' => StudentStatus::getStatus(),
            ]);
        }

        return view('admin.student.edit', [
            'student' => $student,
            'centers' => $centers,
            'sessions' => $sessions,
            'subjects' => $subjects,
            'divisions' => $divisions,
            'districts' => $districts,
            'upazilas' => $upazilas,
            'registration' => Student::getLastFreeRegistration(),
            'roll' => Student::getLastFreeRoll(),
        ]);
    }

    public function update(Request $request, Student $student)
    {

        $admin = Auth::guard('admin')->user();

        if ($admin->hasPermission('student-full-edit')) {
            $validated = $request->validate([
                'center_id' => 'required|exists:centers,id',
                'name' => 'required|string',
                'roll' => ['nullable', Rule::unique('students')->ignore($student->id)],
                'registration' => ['nullable', Rule::unique('students')->ignore($student->id)],
                'passport' => ['nullable', Rule::unique('students')->ignore($student->id)],
                'fathers_name' => 'required|string',
                'mothers_name' => 'required|string',
                'date_of_birth' => 'required',
                'gender' => 'required|numeric|enum_value:'.Gender::class.',false',
                'religion' => 'required|numeric|enum_value:'.Religion::class.',false',
                'present_address' => 'required|string',
                'permanent_address' => 'required|string',
                'phone' => 'nullable|min:11|max:11',
                'session_id' => 'required|exists:sessions,id',
                'subject_id' => 'required|exists:subjects,id',
                'course_duration' => 'required',
                'qualification' => 'required',
                'status' => 'required|numeric',
                'picture' => 'nullable|image',
                'exam_date' => 'nullable',
                'result_publised' => 'nullable',
                'due_amount' => 'required|numeric',
                'paid_amount' => 'required|numeric',
                'payment_status' => 'nullable|numeric|in:0,1',
                'course_type' => ['required', Rule::in(CourseType::asArray())],
                'team_id' => 'nullable|exists:teams,id',
            ]);
            
            if (!$request->hasFile('picture')) {
                unset($validated['picture']);
            }


            $validated['roll'] = $validated['roll']
                ?? ($student->roll ?: Student::getLastFreeRoll());
            $validated['registration'] = $validated['registration']
                ?? ($student->registration ?: Student::getLastFreeRegistration());

            $session = Session::find($validated['session_id']);
            if (empty($validated['exam_date']) && $session) {
                $validated['exam_date'] = $session->exam_date;
            }
            if (empty($validated['result_publised']) && $session) {
                $validated['result_publised'] = $session->result_published_date;
            }

            if ($session && $session->duration) {
                // Update course_type and duration based on session if the session has a duration
                $validated['course_type'] = $session->course_type;
                $validated['course_duration'] = $session->course_duration_string;
            }

            $student->update($validated);
            if ($request->header('X-Inertia')) {
                return redirect()->route('admin.student.index')->with('success', 'Student Updated successfully');
            }

            return response()->report(true, 'Student Updated successfully');
        } else {
            $validated = $request->validate([
                'status' => 'required',
            ]);
            $validated['roll'] = $validated['roll']
                ?? ($student->roll ?: Student::getLastFreeRoll());
            $validated['registration'] = $validated['registration']
                ?? ($student->registration ?: Student::getLastFreeRegistration());
            $student->update($validated);
            if ($request->header('X-Inertia')) {
                return redirect()->route('admin.student.index')->with('success', 'Student Updated successfully');
            }

            return response()->report(true, 'Student Updated successfully');
        }

    }

    public function destroy(Student $student)
    {
        DB::transaction(function () use ($student) {
            Result::where('student_id', $student->id)->delete();
            $student->delete();
        });

        return response()->report($student, 'Student Deleted successfully');
    }
}

