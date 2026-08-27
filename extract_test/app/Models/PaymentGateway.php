<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'store_id',
        'store_password',
        'signature_key',
        'app_key',
        'app_secret',
        'username',
        'password',
        'is_sandbox',
        'is_active',
    ];

    protected $casts = [
        'is_sandbox' => 'boolean',
        'is_active' => 'boolean',
        'store_id' => 'encrypted',
        'store_password' => 'encrypted',
        'signature_key' => 'encrypted',
        'app_key' => 'encrypted',
        'app_secret' => 'encrypted',
        'username' => 'encrypted',
        'password' => 'encrypted',
    ];
}
