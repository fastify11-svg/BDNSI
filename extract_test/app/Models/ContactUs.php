<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ContactUs extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'is_seen',
    ];

    protected static function booted()
    {
        static::saved(function ($model) {
            Cache::forget('unread_inquiries');
        });

        static::deleted(function ($model) {
            Cache::forget('unread_inquiries');
        });
    }
}
