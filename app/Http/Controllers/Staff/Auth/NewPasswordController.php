<?php

namespace App\Http\Controllers\Staff\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     *
     * @return Response
     */
    public function create(Request $request)
    {
        return Inertia::render('Staff/Auth/ResetPassword', [
            'token' => $request->route('token'),
            'email' => $request->email,
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::broker('teams')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($staff) use ($request) {
                $staff->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($staff));
            }
        );

        return $status == Password::PASSWORD_RESET
            ? redirect()->route('staff.login')->with('success', 'Your password has been reset successfully. Please log in.')
            : back()->withInput($request->only('email'))
                ->withErrors(['email' => __($status)]);
    }
}
