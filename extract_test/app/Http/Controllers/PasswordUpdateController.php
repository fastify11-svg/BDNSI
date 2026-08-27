<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordUpdateController extends Controller
{
    public function create()
    {
        return Inertia::render('Center/Password/Update');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'old_password' => 'required|password:web',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        return response()->report(
            Auth::user()->forceFill([
                'password' => Hash::make($validated['password']),
                'remember_token' => Str::random(60),
            ])->save(),
            'Password updated successful'
        );
    }
}
