<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'payable_type',
        'payable_id',
        'trx_id',
        'amount',
        'currency',
        'gateway',
        'status',
        'purpose',
        'gateway_response',
    ];

    protected $casts = [
        'gateway_response' => 'array',
        'amount' => 'decimal:2',
    ];

    public function payable()
    {
        return $this->morphTo();
    }
}
