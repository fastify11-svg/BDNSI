<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated student's email address as verified.
     *
     * @return RedirectResponse
     */
    public function __invoke(EmailVerificationRequest $request)
    {
        if ($request->user('student')->hasVerifiedEmail()) {
            return redirect()->intended(route('student.dashboard').'?verified=1');
        }

        if ($request->user('student')->markEmailAsVerified()) {
            event(new Verified($request->user('student')));
        }

        return redirect()->intended(route('student.dashboard').'?verified=1');
    }
}
