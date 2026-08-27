<?php

namespace App\Http\Controllers;

use App\Enums\StudentStatus;
use App\Models\Student;
use App\Models\AuditLog;
use App\Http\Resources\StudentPublicResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifyController extends Controller
{
    public function index(Request $request)
    {
        $student = null;

        if ($request->has('reg') && strlen(trim($request->reg)) > 0) {
            $student = Student::withoutGlobalScopes()
                ->with([
                    'center',
                    'subject',
                    'session',
                    'result' => fn ($q) => $q->withoutGlobalScopes(),
                    'semesterResults' => fn ($q) => $q->withoutGlobalScopes(),
                ])
                ->where('status', StudentStatus::Approved)
                ->where('registration', $request->reg)
                ->first();

            if ($student) {
                return Inertia::render('Verify', ['student' => new StudentPublicResource($student)]);
            }
        }

        return Inertia::render('Verify');
    }

    public function check(Request $request)
    {
        $request->validate([
            'registration' => 'required|string',
        ]);

        $student = Student::withoutGlobalScopes()
            ->with([
                'center',
                'subject',
                'session',
                'result' => fn ($q) => $q->withoutGlobalScopes(),
                'semesterResults' => fn ($q) => $q->withoutGlobalScopes(),
            ])
            ->where('registration', $request->registration)
            ->where('status', StudentStatus::Approved)
            ->whereHas('result', function ($q) use ($request) {
                if ($request->has('certificate_serial') && $request->certificate_serial) {
                    $q->where('certificate_serial', $request->certificate_serial);
                }
            })
            ->first();

        if (! $student || ! $student->result) {
            return redirect()->back()->withErrors(['error' => 'No valid verified certificate found for this ID/Serial.']);
        }

        AuditLog::create([
            'user_id' => auth()->id() ?? 1,
            'event' => 'CERTIFICATE_VERIFIED',
            'auditable_type' => Student::class,
            'auditable_id' => $student->id,
            'new_values' => ['registration' => $request->registration, 'serial' => $request->certificate_serial],
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'user_agent' => request()->userAgent() ?? 'System'
        ]);

        return Inertia::render('Verify', ['student' => new StudentPublicResource($student)]);
    }
}
