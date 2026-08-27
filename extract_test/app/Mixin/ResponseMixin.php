<?php

namespace App\Mixin;

const ERRORMESSAGE = 'Something went wrong';

class ResponseMixin
{
    public const SUCCESS_MESSAGE_SESSION_KEY = 'success_message';

    public const ERROR_MESSAGE_SESSION_KEY = 'error_message';

    public static function report(): callable
    {
        return function ($condition, $successMessage, $statusCode = 200, $errorMessage = ERRORMESSAGE, $redirectAddress = null) {
            if (request()->wantsJson()) {
                if ($condition) {
                    return response()->json([
                        'type' => 'success',
                        'message' => $successMessage,
                    ], $statusCode);
                }

                return response()->json([
                    'type' => 'error',
                    'message' => $errorMessage,
                ], $statusCode);
            }

            if ($condition) {
                return ($redirectAddress ? redirect($redirectAddress) : back())->with(ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY, $successMessage);
            }

            return back()->with(ResponseMixin::ERROR_MESSAGE_SESSION_KEY, $errorMessage);
        };
    }

    public static function reportTo(): callable
    {
        return function ($condition, $successMessage, $redirectAddress) {
            return $this->report($condition, $successMessage, 200, ERRORMESSAGE, $redirectAddress);
        };
    }

    public static function error(): callable
    {
        return function ($message, $statusCode = 200, $redirectAddress = null) {
            return $this->report(false, '', $statusCode, $message, $redirectAddress);
        };
    }

    public static function success(): callable
    {
        return function ($message, $statusCode = 200, $redirectAddress = null) {
            return $this->report(true, $message, $statusCode, '', $redirectAddress);
        };
    }
}
