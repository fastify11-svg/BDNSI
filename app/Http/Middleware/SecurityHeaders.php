<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Apply security response headers to every outgoing response.
     *
     * These headers defend against clickjacking, MIME-sniffing, and XSS.
     * CSP is set in report-only mode until a site-specific policy is validated.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Prevent this site from being embedded in iframes on other domains
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Stop browsers from MIME-sniffing the response
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Only send referrer to same origin
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // XSS protection for older browsers (modern browsers use CSP instead)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Enforce HTTPS for 1 year (only in production/staging)
        if (app()->environment(['production', 'staging'])) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Restrict powerful browser features
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), payment=()'
        );

        // Content-Security-Policy — baseline policy for Inertia.js + Vite SPA.
        // 'unsafe-inline' is required for Inertia's SSR hydration scripts.
        // Tighten further by adding nonce-based CSP if a dedicated nonce middleware is added.
        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com data:",
                "img-src 'self' data: blob: https:",
                "connect-src 'self' https://generativelanguage.googleapis.com",
                "frame-ancestors 'self'",
                "base-uri 'self'",
                "form-action 'self'",
            ])
        );

        return $response;
    }
}
