<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionPolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'value',
        'team_id',
        'product_type',
        'is_active',
    ];
}
