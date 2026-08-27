<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeScale extends Model
{
    protected $fillable = [
        'course_type',
        'max_marks',
        'rules'
    ];

    protected $casts = [
        'rules' => 'array',
        'course_type' => 'int',
        'max_marks' => 'int'
    ];
}
