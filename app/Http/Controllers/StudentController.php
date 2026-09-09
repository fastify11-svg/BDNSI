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
            $policy = new \App\Policies\AcademicAccessPolicy();
            $center = Auth::user()->center;
            
            return datatables(Student::hide()->select(['id', 'center_id', 'session_id', 'subject_id', 'name', 'status', 'roll', 'payment_status', 'paid_amount', 'due_amount'])
                ->own()
                ->with(['session', 'subject']))
                ->addColumn('admit', function ($admit) use ($policy, $center) {
                    if (!$policy->accessRegistrationDocuments($center, $admit)) {
                        return '<span style="color:red; font-size:12px;">🔒 Locked</span>';
                    }
                    return '<a style="background-color:green; padding:3px; border-radius:4px; color:white" target="_blank" href="'.route('student.show', [$admit->id, 'admit' => 'admit']).'">Admit</a>';
                })
                ->addColumn('registration', function ($registration) use ($policy, $center) {
                    if (!$policy->accessRegistrationDocuments($center, $registration)) {
                        return '<a style="background-color:#BE123C; padding:3px; border-radius:4px; color:white; text-decoration:none;" href="'.route('orders.index').'">Pay Invoice</a>';
                    }
                    $registrationLink = '<a style="background-color:green; padding:3px; border-radius:4px; color:white; text-decoration:none;" target="_blank" href="'
                        .route('student.show', [$registration->id, 'registration' => 'registration'])
                        .'">Registration</a>';

                    $idCardLink = '<a style="background-color:green; padding:3px; border-radius:4px; color:white; text-decoration:none;" target="_blank" href="'
                        .route('student.show', [$registration->id, 'idcard' => 'idcard'])
                        .'">Id Card</a>';

                    return $registrationLink.' '.$idCardLink;
                })
                ->addColumn('result', function ($result) {
                    return '<a  style="background-color:green; padding:3px; border-radius:4px; color:white; text-decoration:none;" target="_blank" href="'.route('result', ['roll' => $result->roll]).'">Result</a>';
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
            'divisions' => \App\Helpers\LocationHelper::getDivisions(),
            'districts' => \App\Helpers\LocationHelper::getDistricts(),
            'upazilas' => \App\Helpers\LocationHelper::getUpazilasGroupedByDistrict(),
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
            'payment_method' => 'nullable|string|in:pay_now,credit',
        ]);

        $center = Auth::user()->center;
        $paymentMethod = $validated['payment_method'] ?? 'pay_now';

        $pricingService = new \App\Services\PricingService();
        $priceData = $pricingService->resolvePrice('registration', $center->id);
        $finalPrice = $priceData['final_price'];

        // Enforce credit rules before creating anything
        if ($finalPrice > 0 && $paymentMethod === 'credit') {
            if (!$center || !$center->allow_registration_without_payment) {
                return back()->withErrors(['payment_method' => 'You are not authorized to use credit. Please select Pay Now.']);
            }
            if (!$center->hasSufficientCredit($finalPrice)) {
                return back()->withErrors(['payment_method' => 'Credit limit exceeded. Please select Pay Now or clear dues.']);
            }
        }

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
        $validated['center_id'] = $center->id;
        $validated['status'] = StudentStatus::Pending;
        $validated['payment_status'] = 0;
        $validated['due_amount'] = $finalPrice;
        $validated['paid_amount'] = 0;

        $student = Student::create($validated);

        $order = \App\Models\Order::create([
            'center_id' => $validated['center_id'],
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'total_amount' => $finalPrice,
            'discount_amount' => $priceData['discount'],
            'payable_amount' => $finalPrice,
            'paid_amount' => 0,
            'due_amount' => $finalPrice,
            'status' => 'Pending',
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

        $message = 'Congratulations!! '.$student->name.', You have successfully filled the application form for  '
            .($center->name ?? '').' Technician '
            .($student->subject->name ?? '').' under  '.config('site.setting.name').' Your Roll No: '
            .$student->roll.' and Registration No: '.$student->registration.'. Thanks for staying with National '.config('site.setting.name');
        
        SendStudentSmsJob::dispatch($student->phone, $message);

        if ($finalPrice > 0) {
            if ($paymentMethod === 'credit') {
                $ledgerService = new \App\Services\FinancialLedgerService();
                $ledgerService->recordOrder($center, $order, $finalPrice, 'Student Registration Fee - ' . $student->registration);
                
                return redirect()->route('student.index')->with('success', 'Student Created successfully. Registration fee added to due.');
            } else {
                return redirect()->route('center.orders.show', $order->id)->with('warning', 'Registration saved. Please pay the invoice to unlock documents.');
            }
        } else {
            $student->update([
                'payment_status' => 1,
                'paid_amount' => 0,
                'due_amount' => 0,
            ]);
            
            $order->update(['status' => \App\Models\Order::STATUS_PAID]);
            
            return redirect()->route('student.index')->with('success', 'Student Created successfully (Free).');
        }
    }

    public function show(Request $request, Student $student)
    {


        $policy = new \App\Policies\AcademicAccessPolicy();
        if (!$policy->accessRegistrationDocuments(Auth::user()->center, $student)) {
            abort(403, 'Document access blocked due to unpaid balance.');
        }

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


        if ($student->status->isNot(StudentStatus::Pending())) {
            return response()->error('Can\'t update student which is not in pending status');
        }

        return view('student.edit', [
            'student' => $student,
            'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
            'subjects' => Subject::select(['id', 'name'])->get(),
            'divisions' => \App\Helpers\LocationHelper::getDivisions(),
            'districts_keys' => \App\Helpers\LocationHelper::getDistrictsGroupedByDivision(),
            'districts' => \App\Helpers\LocationHelper::getDistricts(),
            'upazilas' => \App\Helpers\LocationHelper::getUpazilasGroupedByDistrict()->toArray(),
        ]);
    }

    public function update(Request $request, Student $student)
    {


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
