<?php

namespace App\Models;

use App\Scopes\CenterScope;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CenterLedger extends Model
{

    protected static function booted()
    {
        static::addGlobalScope(new CenterScope);
    }

    use HasFactory;

    protected $fillable = [
        'center_id',
        'type',
        'amount',
        'balance_after',
        'reference_id',
        'reference_type',
        'description',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }
}

