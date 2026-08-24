<?php

namespace App\Http\Middleware;

use App\Mixin\ResponseMixin;
use App\Models\ContactUs;
use App\Models\FooterLink;
use App\Models\FooterPartnerLogo;
use App\Models\SiteConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $adminUser = auth('admin')->user();
        $staffUser = auth('staff')->user();
        $studentUser = auth('student')->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? null,
                    'center_id' => $user->center_id ?? null,
                    'center' => $user->center ? [
                        'id' => $user->center->id,
                        'code' => $user->center->code ?? str_pad($user->center->id, 6, '178', STR_PAD_LEFT),
                        'name' => $user->center->name,
                        'owner_name' => $user->center->owner_name ?? $user->center->director_name ?? $user->name,
                        'fathers_name' => $user->center->fathers_name ?? 'N/A',
                        'mothers_name' => $user->center->mothers_name ?? 'N/A',
                        'religion' => is_object($user->center->religion) ? $user->center->religion->description : ($user->center->religion ?? 'N/A'),
                        'gender' => is_object($user->center->gender) ? $user->center->gender->description : ($user->center->gender ?? 'N/A'),
                        'center_location' => $user->center->center_location ?? 'N/A',
                        'address' => $user->center->address ?? 'N/A',
                        'mobile' => $user->center->mobile ?? $user->phone ?? 'N/A',
                        'email' => $user->center->email ?? $user->email,
                        'center_logo' => $user->center->center_logo ?? null,
                        'status' => is_object($user->center->status) ? $user->center->status->value : $user->center->status,
                    ] : null,
                    'avatar' => $user->avatar ?? null,
                    'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames() : [],
                ] : null,
                'admin' => $adminUser ? [
                    'id' => $adminUser->id,
                    'name' => $adminUser->name,
                    'email' => $adminUser->email,
                    'avatar' => $adminUser->avatar ?? null,
                    'roles' => method_exists($adminUser, 'getRoleNames') ? $adminUser->getRoleNames() : [],
                    'permissions' => method_exists($adminUser, 'allPermissions') ? $adminUser->allPermissions()->pluck('name') : [],
                    'unread_inquiries_count' => Cache::remember('unread_inquiries', 60, function () {
                        return ContactUs::where('is_seen', false)->count();
                    }),
                ] : null,
                'staff' => $staffUser ? [
                    'id' => $staffUser->id,
                    'name' => $staffUser->name,
                    'designation' => $staffUser->designation,
                    'email' => $staffUser->email,
                    'phone' => $staffUser->phone,
                    'referral_code' => $staffUser->referral_code,
                    'referral_link' => url('/?ref=' . $staffUser->referral_code),
                    'image' => $staffUser->image,
                    'is_active' => (bool)$staffUser->is_active,
                ] : null,
                'student' => $studentUser ? [
                    'id' => $studentUser->id,
                    'name' => $studentUser->name,
                    'roll' => $studentUser->roll,
                    'registration' => $studentUser->registration,
                    'email' => $studentUser->email,
                    'phone' => $studentUser->phone,
                    'picture' => $studentUser->picture,
                    'status' => is_object($studentUser->status) ? $studentUser->status->value : $studentUser->status,
                    'status_label' => is_object($studentUser->status) ? $studentUser->status->name : ($studentUser->status == 1 ? 'Approved' : 'Pending Review'),
                    'due_amount' => $studentUser->due_amount ?? 0,
                    'paid_amount' => $studentUser->paid_amount ?? 0,
                    'payment_status' => $studentUser->payment_status ?? 'Paid',
                    'center' => $studentUser->center ? [
                        'id' => $studentUser->center->id,
                        'name' => $studentUser->center->name,
                        'code' => $studentUser->center->code,
                    ] : null,
                    'subject' => $studentUser->subject ? [
                        'id' => $studentUser->subject->id,
                        'name' => $studentUser->subject->name,
                        'code' => $studentUser->subject->code,
                    ] : null,
                    'session' => $studentUser->session ? [
                        'id' => $studentUser->session->id,
                        'name' => $studentUser->session->name,
                        'duration' => $studentUser->session->duration,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get(ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY) ?? $request->session()->get('success'),
                'error' => fn () => $request->session()->get(ResponseMixin::ERROR_MESSAGE_SESSION_KEY) ?? $request->session()->get('error'),
            ],
            'app_url' => url('/'),
            'locale' => app()->getLocale(),
            'site' => [
                'name' => config('site.setting.name', 'BDNSI'),
                'notice' => SiteConfig::firstCached()->marquee_notice ?? 'Welcome to BDNSI Portal',
            ],
            'site_config' => function () {
                $c = SiteConfig::firstCached();

                return $c ? $c->only([
                    'portal_name', 'tagline', 'header_logo', 'main_logo', 'favicon',
                    'site_phone', 'official_email', 'headquarter_address',
                    'facebook_url', 'youtube_url', 'twitter_url', 'linkedin_url',
                    'marquee_notice', 'about_short', 'footer_copyright',
                    'toggle_center_apply', 'toggle_result_verify', 'toggle_success_students',
                    'toggle_video_gallery', 'toggle_photo_gallery', 'toggle_verified_centers',
                    'toggle_sponsors', 'toggle_notice_board', 'toggle_contact_form', 'toggle_whatsapp',
                    'primary_color', 'secondary_color', 'accent_color',
                    'footer_top_bg_image', 'footer_side_bg_image', 'footer_disclaimer_text',
                    'footer_planning_text', 'footer_tech_support_text',
                ]) : (object) [];
            },
            'footer_links' => function () {
                return Cache::remember('footer_links', 3600, function () {
                    return FooterLink::where('is_active', 1)->orderBy('sort_order', 'asc')->get();
                });
            },
            'footer_logos' => function () {
                return Cache::remember('footer_logos', 3600, function () {
                    return FooterPartnerLogo::where('is_active', 1)->get();
                });
            },
        ]);
    }
}
