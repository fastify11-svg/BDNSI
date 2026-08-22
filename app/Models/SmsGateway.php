<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsGateway extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_name',
        'base_url',
        'api_key',
        'secret_key',
        'sender_id',
        'is_active',
    ];
}
