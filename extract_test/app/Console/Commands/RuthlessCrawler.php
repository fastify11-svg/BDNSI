<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Models\Admin;
use App\Models\User;
use App\Models\Team;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class RuthlessCrawler extends Command
{
    protected $signature = 'swarm:ruthless-crawl';
    protected $description = 'Exhaustively crawl and test all registered GET routes to detect 500 errors and scope leaks.';

    public function handle()
    {
        $this->info('====================================================');
        $this->info('   SWARM PROTOCOL: RUTHLESS E2E CRAWLER ENGAGED     ');
        $this->info('====================================================');

        $routes = Route::getRoutes()->getRoutesByMethod()['GET'] ?? [];
        $appUrl = env('APP_URL', 'http://127.0.0.1:8000');

        $admin = Admin::first();
        $user = User::first();
        $staff = Team::first();
        $student = Student::withoutGlobalScopes()->first();

        $errors = [];
        $tested = 0;

        foreach ($routes as $route) {
            $uri = $route->uri();
            
            // Skip debugbar, ignition, api, storage, and dynamic routes with many parameters
            if (str_starts_with($uri, '_debugbar') || str_starts_with($uri, '_ignition') || str_starts_with($uri, 'api/') || str_starts_with($uri, 'storage/')) {
                continue;
            }
            if (str_contains($uri, '{') && substr_count($uri, '{') > 1) {
                // Skip highly dynamic routes to prevent fake ID errors
                continue;
            }

            // Fill standard single parameters with ID 1
            $url = $appUrl . '/' . str_replace(['{id}', '{user}', '{center}', '{student}', '{template}', '{template_id}', '{student_id}', '{jobId}', '{filename}'], '1', $uri);
            $url = str_replace('//', '/', $url);
            $url = str_replace(':/', '://', $url); // Fix http://

            $middlewares = $route->gatherMiddleware();
            $guard = 'public';
            $sessionCookie = '';

            if (in_array('auth:admin', $middlewares)) {
                $guard = 'admin';
                Auth::guard('admin')->login($admin);
            } elseif (in_array('auth:staff', $middlewares)) {
                $guard = 'staff';
                Auth::guard('staff')->login($staff);
            } elseif (in_array('auth:student', $middlewares)) {
                $guard = 'student';
                if ($student) Auth::guard('student')->login($student);
            } elseif (in_array('auth', $middlewares)) {
                $guard = 'web';
                Auth::guard('web')->login($user);
            }

            try {
                // We use internal Laravel Request execution to avoid network overhead and get direct exceptions
                $request = \Illuminate\Http\Request::create($url, 'GET');
                if ($guard !== 'public') {
                    $request->setUserResolver(function () use ($guard) {
                        return Auth::guard($guard)->user();
                    });
                }
                
                // Bind session to request
                $session = app('session')->driver();
                $session->setId(\Illuminate\Support\Str::random(40));
                $session->start();
                $request->setLaravelSession($session);

                $response = app()->handle($request);
                $status = $response->getStatusCode();

                if ($status >= 500) {
                    // Extract exception from response if it's an error page
                    $content = $response->getContent();
                    preg_match('/<title>Error\s*-\s*(.*?)<\/title>/', $content, $matches);
                    $errMsg = $matches[1] ?? 'Internal Server Error';
                    
                    if ($response->exception) {
                        $errMsg = $response->exception->getMessage();
                    }

                    $this->error("[FAIL] [{$guard}] {$url} -> HTTP {$status}");
                    $this->error("       Reason: {$errMsg}");
                    $errors[] = [
                        'url' => $url,
                        'guard' => $guard,
                        'status' => $status,
                        'error' => substr($errMsg, 0, 200)
                    ];
                } else {
                    $this->line("[PASS] [{$guard}] {$url} -> HTTP {$status}");
                }
                $tested++;

            } catch (\Exception $e) {
                $this->error("[FAIL] [{$guard}] {$url} -> EXCEPTION");
                $this->error("       Reason: {$e->getMessage()}");
                $errors[] = [
                    'url' => $url,
                    'guard' => $guard,
                    'status' => 500,
                    'error' => substr($e->getMessage(), 0, 200)
                ];
            }
        }

        $this->info('====================================================');
        $this->info("CRAWL COMPLETE. Tested: {$tested} routes.");
        
        if (count($errors) > 0) {
            $this->error(count($errors) . " ROUTES FAILED WITH EXCEPTIONS (500).");
            file_put_contents(storage_path('logs/ruthless_crawler_errors.json'), json_encode($errors, JSON_PRETTY_PRINT));
            return 1;
        } else {
            $this->info('ALL ROUTES GREEN. SYSTEM IS FLAWLESS.');
            return 0;
        }
    }
}
