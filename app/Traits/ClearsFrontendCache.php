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
        Cache::forget('homepage_payload_v2');
    }
}
