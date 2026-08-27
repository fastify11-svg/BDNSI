<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class PasswordUpdateController extends Controller
{
    public function create()
    {
        return view('admin.password-update.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'old_password' => 'required',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if (! Hash::check($validated['old_password'], Auth::guard('admin')->user()->password)) {
            return response()->error('The old password does not match our records.');
        }

        return response()->report(
            Auth::user()->forceFill([
                'password' => Hash::make($validated['password']),
                'remember_token' => Str::random(60),
            ])->save(),
            'Password updated successful'
        );
    }
}
