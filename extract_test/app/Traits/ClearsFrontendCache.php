<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait ClearsFrontendCache
{
    protected static function bootClearsFrontendCache()
    {
        static::saved(function ($model) {
            self::clearRelatedFrontendCache();
        });

        static::deleted(function ($model) {
            self::clearRelatedFrontendCache();
        });
    }

    protected static function clearRelatedFrontendCache()
    {
        Cache::forget('homepage_counts');
        Cache::forget('homepage_sliders');
        Cache::forget('homepage_sponsors');
        Cache::forget('homepage_photo_gallery');
        Cache::forget('homepage_courses');
        Cache::forget('homepage_teams');
        Cache::forget('homepage_youtube_videos');
        Cache::forget('homepage_notices');
        Cache::forget('homepage_centers');
        Cache::forget('homepage_success_students');
    }
}
