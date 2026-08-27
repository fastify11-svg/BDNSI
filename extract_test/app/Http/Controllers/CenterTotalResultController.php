<?php

namespace App\Http\Controllers;

use App\Enums\SessionStatus;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class CenterTotalResultController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return Response
     */
    public function __invoke(Request $request)
    {

        if ($request->has(['session_id', 'subject_id'])) {
            $center = auth()->user()->center;
            $students = Student::with('result', 'subject:id,name', 'session:id,name')->where('center_id', $center->id)->where(['session_id' => $request->session_id, 'subject_id' => $request->subject_id])->get();

            $policy = new \App\Policies\AcademicAccessPolicy();
            
            $students->transform(function ($student) use ($policy, $center) {
                $studentArray = $student->toArray();
                if (!$policy->publishResult($center, $student)) {
                    unset($studentArray['result']);
                    $studentArray['result_error'] = 'Result blocked due to unpaid balance and insufficient credit limit.';
                }
                return $studentArray;
            });

            return Inertia::render('Center/Student/Result', [
                'students' => $students,
                'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
                'subjects' => Subject::select(['id', 'name'])->get(),
            ]);
        }

        return Inertia::render('Center/Student/Result', [
            'students' => [],
            'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
            'subjects' => Subject::select(['id', 'name'])->get(),
        ]);

    }
}
