<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatappLink extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'description',
        'status',
    ];
}
