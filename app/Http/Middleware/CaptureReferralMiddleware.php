<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class CaptureReferralMiddleware
{
    /**
     * Handle an incoming request and capture staff referral parameters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $refCode = $request->query('ref') ?? $request->query('referral');

        if ($refCode) {
            $staff = Team::where('referral_code', strtoupper(trim($refCode)))
                ->where('is_active', true)
                ->first();

            if ($staff) {
                // Store in session
                session([
                    'staff_referral_id' => $staff->id,
                    'staff_referral_code' => $staff->referral_code,
                    'staff_referral_name' => $staff->name,
                ]);

                // Store in 30-day cookie
                Cookie::queue('bdnsi_staff_ref_id', $staff->id, 60 * 24 * 30);
                Cookie::queue('bdnsi_staff_ref_code', $staff->referral_code, 60 * 24 * 30);
            }
        }

        return $next($request);
    }
}
