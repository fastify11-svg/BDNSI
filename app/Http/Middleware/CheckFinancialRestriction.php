<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckFinancialRestriction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $center = auth('center')->user(); // Adjust guard if necessary

        if ($center && $center->auto_restriction) {
            $classification = $center->due_classification;
            if (in_array($classification, ['CREDIT_LIMIT_REACHED', 'RESTRICTED'])) {
                if ($request->header('X-Inertia')) {
                    return redirect()->back()->with('error', 'Action restricted due to financial credit limit being reached. Please clear your dues.');
                }
                return redirect()->back()->withErrors(['financial' => 'Action restricted due to financial credit limit being reached. Please clear your dues.']);
            }
        }

        return $next($request);
    }
}
