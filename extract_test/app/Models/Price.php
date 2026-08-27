<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    use HasFactory;

    protected $fillable = [
        'center_id',
        'product_type',
        'base_price',
        'discount',
        'effective_from',
        'status',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'status' => 'boolean',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }
}
