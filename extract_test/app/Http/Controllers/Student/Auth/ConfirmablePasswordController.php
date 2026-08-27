<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password view.
     *
     * @return View
     */
    public function show()
    {
        return view('student.auth.confirm-password');
    }

    /**
     * Confirm the student's password.
     *
     * @return mixed
     */
    public function store(Request $request)
    {
        if (! Auth::guard('student')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('student.auth.password_confirmed_at', time());

        return redirect()->intended(route('student.dashboard'));
    }
}
