<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quation extends Model
{
    protected $fillable = [
        'exam_id',
        'body',
        'option_1',
        'option_2',
        'option_3',
        'option_4',
        'answer',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }
}
