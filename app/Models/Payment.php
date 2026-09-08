<?php

namespace App\Models;

use App\Scopes\CenterScope;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{

    protected static function booted()
    {
        static::addGlobalScope(new CenterScope);
    }

    protected $fillable = [
        'student_id',
        'center_id',
        'amount',
        'purpose',
        'status',
        'transaction_id',
        'payment_method'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function center()
    {
        return $this->belongsTo(Center::class);
    }
}

