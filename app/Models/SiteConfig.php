<?php

namespace App\Models;

use App\Lib\Image;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SiteConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'portal_name', 'tagline', 'rjsc_id', 'header_logo', 'main_logo', 'favicon',
        'hotline_phone', 'official_email', 'headquarter_address',
        'facebook_url', 'youtube_url', 'twitter_url', 'linkedin_url',
        'marquee_notice', 'about_short', 'about_full', 'terms_conditions',
        'privacy_policy', 'footer_copyright',
        'toggle_center_apply', 'toggle_result_verify', 'toggle_success_students',
        'toggle_video_gallery', 'toggle_photo_gallery', 'toggle_verified_centers',
        'toggle_sponsors', 'toggle_notice_board', 'toggle_contact_form', 'toggle_whatsapp', 'toggle_student_portal',
        'primary_color', 'secondary_color', 'accent_color',
        'footer_top_bg_image', 'footer_side_bg_image', 'footer_disclaimer_text',
        'footer_planning_text', 'footer_tech_support_text',
    ];

    public const CACHE_KEY = 'site_config_cache';

    protected static $cachedConfig = null;

    protected static function booted()
    {
        static::saved(function ($config) {
            Cache::forget(self::CACHE_KEY);
            self::$cachedConfig = null;
        });
    }

    public static function firstCached()
    {
        if (self::$cachedConfig !== null && self::$cachedConfig instanceof self) {
            return self::$cachedConfig;
        }

        $cached = Cache::remember(self::CACHE_KEY, now()->addHours(24), function () {
            return self::first();
        });

        // Laravel 13 may reject/incomplete previously serialized models until cache is rebuilt.
        if (! $cached instanceof self) {
            Cache::forget(self::CACHE_KEY);
            $cached = self::first();
            if ($cached) {
                Cache::put(self::CACHE_KEY, $cached, now()->addHours(24));
            }
        }

        self::$cachedConfig = $cached;

        return self::$cachedConfig;
    }

    public static function isEnabled($feature)
    {
        $config = self::firstCached();
        if (! $config) {
            return true;
        }

        // Feature flags are stored as 'on' / 'off' or 1 / 0
        $value = $config->{$feature} ?? 1;

        return $value === 'on' || $value === 1 || $value === '1';
    }

    public function getMainLogoAttribute($value)
    {
        return Image::url($value);
    }

    public function getHeaderLogoAttribute($value)
    {
        return Image::url($value);
    }

    public function getFaviconAttribute($value)
    {
        return Image::url($value);
    }

    public function getFooterTopBgImageAttribute($value)
    {
        return Image::url($value);
    }

    public function getFooterSideBgImageAttribute($value)
    {
        return Image::url($value);
    }

    public static function updateSettings(Request $request)
    {
        $config = self::first() ?? new self;

        $data = $request->except(['_token', '_method', 'created_at', 'main_logo', 'favicon', 'header_logo', 'footer_top_bg_image', 'footer_side_bg_image']);

        foreach (['main_logo', 'favicon', 'header_logo', 'footer_top_bg_image', 'footer_side_bg_image'] as $imageKey) {
            if ($request->hasFile($imageKey)) {
                $data[$imageKey] = Image::store($imageKey, 'config');
            } elseif ($request->has($imageKey) && ! is_string($request->input($imageKey))) {
                unset($data[$imageKey]);
            }
        }

        $config->fill($data);
        $config->save();

        return $config;
    }
}
