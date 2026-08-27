<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    public function render($request, \Throwable $e)
    {
        if ($e instanceof ThrottleRequestsException) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'আপনি খুব বেশিবার চেষ্টা করেছেন। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'], 429);
            }

            return response()->view('errors.429', ['message' => 'আপনি খুব বেশিবার চেষ্টা করেছেন। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'], 429);
        }

        return parent::render($request, $e);
    }
}
