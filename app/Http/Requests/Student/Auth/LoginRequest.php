<?php

namespace App\Http\Requests\Student\Auth;

use App\Models\Student;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the student is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'login' => 'required|string',
            'password' => 'required|string',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @return void
     *
     * @throws ValidationException
     */
    public function authenticate()
    {
        $this->ensureIsNotRateLimited();

        $login = trim($this->input('login'));
        $password = $this->input('password');

        // Support authentication via Roll, Registration, Mobile, or Email
        $student = Student::withoutGlobalScopes()
            ->where(function ($query) use ($login) {
                $query->where('roll', $login)
                      ->orWhere('registration', $login)
                      ->orWhere('phone', $login)
                      ->orWhere('email', $login);
            })
            ->first();

        if (! $student || ! Hash::check($password, $student->password)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'login' => __('These student credentials do not match our academic records.'),
            ]);
        }

        Auth::guard('student')->login($student, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @return void
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited()
    {
        if (app()->environment(['local', 'testing'])) {
            return;
        }

        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     *
     * @return string
     */
    public function throttleKey()
    {
        return Str::lower($this->input('login')) . '|' . $this->ip() . '|student';
    }
}
