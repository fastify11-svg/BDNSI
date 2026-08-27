<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     *
     * @return mixed
     */
    public function __invoke(Request $request)
    {
        return $request->user('student')->hasVerifiedEmail()
                    ? redirect()->intended(route('student.dashboard'))
                    : view('student.auth.verify-email');
    }
}
