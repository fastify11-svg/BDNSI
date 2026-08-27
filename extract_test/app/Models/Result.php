<?php

namespace App\Models;

use App\Scopes\CenterScope;
use Illuminate\Database\Eloquent\Model;

/**
 * @property Student $student
 * @property int student_id
 * @property int written
 * @property int practical
 * @property int viva
 */
class Result extends Model
{
    protected static function booted()
    {
        static::addGlobalScope(new CenterScope);

        static::saving(function ($result) {
            $total = (int) $result->written + (int) $result->practical + (int) $result->viva;
            if ($total > 0) {
                $student = $result->student ?? Student::find($result->student_id);
                if ($student) {
                    $courseType = $student->course_type;
                    $typeStr = is_object($courseType) ? ($courseType->value ?? $courseType->description) : $courseType;

                    $limit = 100;
                    $typeInt = 0;
                    if ($typeStr == 0 || $typeStr === '0' || $typeStr === 'Regular') {
                        $typeInt = 0;
                        $limit = 100;
                    } elseif ($typeStr == 1 || $typeStr === '1' || $typeStr === 'Short_Course' || $typeStr === 'Short Course') {
                        $typeInt = 1;
                        $limit = 1200;
                    } elseif ($typeStr == 2 || $typeStr === '2' || $typeStr === 'Diploma') {
                        $typeInt = 2;
                        $limit = 4800;
                    }

                    // Dynamic limit check based on grade_scales
                    $scale = \App\Models\GradeScale::where('course_type', $typeInt)->first();
                    if ($scale && $scale->max_marks > 0) {
                        $limit = $scale->max_marks;
                    }

                    if ($total > $limit) {
                        throw new \Exception("Total marks ($total) exceeds the maximum limit ($limit) for this course.");
                    }
                }
            }
        });
    }

    protected $fillable = [
        'student_id',
        'written',
        'practical',
        'viva',
        'certificate',
    ];

    protected $casts = [
        'student_id' => 'int',
        'written' => 'int',
        'practical' => 'int',
        'viva' => 'int',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function gpa()
    {
        $mark = $this->written + $this->practical + $this->viva;
        $student = $this->student;
        if (!$student) return '';

        $courseType = $student->course_type;
        $typeStr = is_object($courseType) ? ($courseType->value ?? $courseType->description) : $courseType;
        
        $typeInt = 0;
        if ($typeStr == 1 || $typeStr === '1' || $typeStr === 'Short_Course' || $typeStr === 'Short Course') {
            $typeInt = 1;
        } elseif ($typeStr == 2 || $typeStr === '2' || $typeStr === 'Diploma') {
            $typeInt = 2;
        }

        $scale = \App\Models\GradeScale::where('course_type', $typeInt)->first();

        if ($scale && $scale->rules && is_array($scale->rules)) {
            $max = $scale->max_marks > 0 ? $scale->max_marks : 100;
            $percent = ($mark / $max) * 100;
            
            foreach ($scale->rules as $rule) {
                if (isset($rule['min_percent']) && isset($rule['max_percent'])) {
                    if ($percent >= $rule['min_percent'] && $percent <= $rule['max_percent']) {
                        return $rule['grade_name'] ?? '';
                    }
                }
            }
            return 'F'; // Fallback if out of bounds but rules exist
        }

        // Fallback to hardcoded regular grading if no dynamic rules are set yet
        $limit = $typeInt === 2 ? 4800 : ($typeInt === 1 ? 1200 : 100);
        $percent = ($mark / $limit) * 100;

        if ($percent >= 80) return 'A+';
        if ($percent >= 70) return 'A';
        if ($percent >= 60) return 'A-';
        if ($percent >= 50) return 'B';
        if ($percent >= 40) return 'C';
        if ($percent >= 0) return 'F';
        
        return '';
    }
}
