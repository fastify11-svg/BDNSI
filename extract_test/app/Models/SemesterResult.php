<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'semester_name',
        'semester_gpa',
        'subjects_data',
    ];

    protected $casts = [
        'semester_gpa' => 'decimal:2',
        'subjects_data' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
