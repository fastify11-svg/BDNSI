<?php

namespace App\Http\Middleware;

use App\Models\SiteConfig;
use Closure;
use Illuminate\Http\Request;

class CheckModuleEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  string  $moduleName
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $moduleName)
    {
        if (! SiteConfig::isEnabled($moduleName)) {
            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json(['message' => 'This module is currently disabled by the administrator.'], 403);
            }
            
            return \Inertia\Inertia::render('Frontend/ComingSoon', [
                'module' => $moduleName,
                'message' => 'This feature is currently being updated and will be available soon.'
            ])->toResponse($request);
        }

        return $next($request);
    }
}
