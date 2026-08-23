<?php

namespace App\Http\Controllers;

use App\Enums\StudentStatus;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifyController extends Controller
{
    public function index(Request $request)
    {
        $student = null;

        if ($request->has('reg') && strlen(trim($request->reg)) > 0) {
            // BUG-005 FIX: withoutGlobalScopes() bypasses CenterScope so public
            // verification works without an authenticated center session.
            // BUG-004 FIX: result is eager-loaded with withoutGlobalScopes on the
            // sub-query to prevent silent null returns.
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
                return Inertia::render('Verify', ['student' => $student]);
            }
        }

        return Inertia::render('Verify');
    }

    public function check(Request $request)
    {
        $request->validate([
            'registration' => 'required|string',
        ]);

        // BUG-005 FIX: withoutGlobalScopes() bypasses CenterScope
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
            ->first();

        if (! $student) {
            return redirect()->back()->withErrors(['error' => 'No valid registration or diploma found for this ID.']);
        }

        return Inertia::render('Verify', ['student' => $student]);
    }
}
