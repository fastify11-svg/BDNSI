<?php

namespace App\Http\Controllers;

use App\Enums\StudentStatus;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function __invoke(Request $request)
    {
        $student = null;
        $error = null;

        if ($request->has('roll') && strlen(trim($request->get('roll')))) {
            $search = trim($request->get('roll'));

            $student = Student::with(['subject', 'center', 'session', 'result' => function ($query) {
                $query->withoutGlobalScopes();
            }])
                ->where('roll', $search)
                ->orWhere('registration', $search)
                ->orWhere('passport', $search)
                ->first();

            if ($student === null || (isset($student->status) && method_exists($student->status, 'is') && $student->status->is(StudentStatus::Hide()))) {
                $student = null;
                $error = 'Result not found for the entered Roll, Registration, or Passport number.';
            } elseif ($student->result === null) {
                $student = null;
                $error = 'Result has not been published yet for this student.';
            }
        }

        return Inertia::render('Result', [
            'student' => $student,
            'error' => $error,
        ]);
    }
}
