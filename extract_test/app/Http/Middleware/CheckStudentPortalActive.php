<?php

namespace App\Http\Middleware;

use App\Models\SiteConfig;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckStudentPortalActive
{
    /**
     * Handle an incoming request to verify student portal active status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Cache-optimized kill switch check
        if (! SiteConfig::isEnabled('toggle_student_portal')) {
            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json([
                    'status' => 'offline',
                    'message' => 'The Student Portal is temporarily closed for maintenance. Please check back later.',
                ], 503);
            }

            return Inertia::render('Student/Maintenance', [
                'portal_name' => SiteConfig::firstCached()->portal_name ?? 'BDNSI Portal',
                'message' => 'The Student Portal is currently closed for administrative maintenance and result synchronization.',
            ])->toResponse($request);
        }

        return $next($request);
    }
}
