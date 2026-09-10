<?php

namespace App\Models;

use App\Enums\CourseType;
use App\Traits\BelongsToStaff;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use BelongsToStaff, HasFactory;

    protected $fillable = [
        'team_id',
        'name',
        'duration',
        'exam_date',
        'result_published_date',
        'status',
    ];

    protected $appends = ['course_duration_string'];

    protected $casts = [
        'duration' => 'int',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->duration)) {
                $model->duration = 6;
            }
        });
    }

    public function getCourseTypeAttribute()
    {
        $duration = $this->duration;
        if (! $duration) {
            return CourseType::Regular;
        }

        if ($duration >= 1 && $duration <= 3) {
            return CourseType::Regular;
        } elseif ($duration > 3 && $duration <= 24) {
            return CourseType::Short_Course;
        } elseif ($duration > 24 && $duration <= 48) {
            return CourseType::Diploma;
        }

        return CourseType::Regular; // fallback
    }

    public function getCourseDurationStringAttribute()
    {
        $duration = $this->duration;
        if (! $duration) {
            return '';
        }

        if ($duration == 1) {
            return 'One Month';
        }
        if ($duration == 2) {
            return 'Two Months';
        }
        if ($duration == 3) {
            return 'Three Months';
        }
        if ($duration == 6) {
            return 'Six Months';
        }
        if ($duration == 12) {
            return 'One Year';
        }
        if ($duration == 18) {
            return 'One Year Six Months';
        }
        if ($duration == 24) {
            return 'Two Years';
        }
        if ($duration == 36) {
            return 'Three Years';
        }
        if ($duration == 48) {
            return 'Four Years';
        }

        return $duration.' Months';
    }
}
