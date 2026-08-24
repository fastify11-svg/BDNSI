<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        return Inertia::render('Student/Documents', [
            'student' => $student,
        ]);
    }

    public function results(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        return Inertia::render('Student/Results', [
            'student' => $student,
            'result' => $student->result,
            'semesterResults' => $student->semesterResults,
        ]);
    }

    public function idCard(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        return view('student.document.wrapper', [
            'type' => 'idcard',
            'title' => 'Student Digital ID Card',
            'student' => $student,
        ]);
    }

    public function admitCard(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        return view('student.document.wrapper', [
            'type' => 'admit-card',
            'title' => 'Examination Admit Card',
            'student' => $student,
        ]);
    }

    public function registrationCard(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        return view('student.document.wrapper', [
            'type' => 'registration-card',
            'title' => 'Official Registration Card',
            'student' => $student,
        ]);
    }

    public function marksheet(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        return view('student.document.wrapper', [
            'type' => 'transcript',
            'title' => 'Academic Transcript & Marksheet',
            'student' => $student,
        ]);
    }

    private function getAuthenticatedStudent(): Student
    {
        $studentId = Auth::guard('student')->id();

        return Student::withoutGlobalScopes()
            ->with(['center', 'subject', 'session', 'result', 'semesterResults'])
            ->findOrFail($studentId);
    }
}
