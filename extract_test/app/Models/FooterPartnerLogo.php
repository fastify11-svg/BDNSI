<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class FooterPartnerLogo extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'image_path', 'url', 'sort_order', 'is_active'];

    protected static function booted()
    {
        static::saved(function ($model) {
            Cache::forget('footer_logos');
        });

        static::deleted(function ($model) {
            Cache::forget('footer_logos');
        });
    }
}
