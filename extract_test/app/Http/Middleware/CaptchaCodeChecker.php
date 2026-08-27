<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CaptchaCodeChecker
{
    /**
     * The application instance.
     *
     * @var Application
     */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response|RedirectResponse)  $next
     * @return Response|RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->has(['code', '_code'])) {
            if ($this->checkCode($request->get('code'), $request->get('_code'))) {
                return $next($request);
            }
        } elseif ($this->runningUnitTests()) {
            return $next($request);
        }
        throw ValidationException::withMessages([
            'code' => [
                'invalid code',
            ],
        ]);
    }

    protected function runningUnitTests()
    {
        return $this->app->runningInConsole() && $this->app->runningUnitTests();
    }

    public static function generateCode()
    {
        return Str::random(6);
    }

    public static function encryptCode($code)
    {
        return encrypt($code);
    }

    protected function checkCode($code, $encrypted)
    {
        return decrypt($encrypted) === $code;
    }
}
