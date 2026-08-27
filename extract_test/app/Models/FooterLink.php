<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class FooterLink extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'url', 'sort_order', 'is_active'];

    protected static function booted()
    {
        static::saved(function ($model) {
            Cache::forget('footer_links');
        });

        static::deleted(function ($model) {
            Cache::forget('footer_links');
        });
    }
}
