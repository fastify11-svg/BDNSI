<?php

namespace App\Models;

use App\Enums\CourseType;
use App\Lib\Image;
use App\Traits\BelongsToStaff;
use App\Traits\ClearsFrontendCache;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use BelongsToStaff, ClearsFrontendCache;

    protected $fillable = [
        'team_id',
        'name',
        'code',
        'photo',
        'duration',
        'rate',
        'education_qualification',
        'course_details',
        'type',
    ];

    protected $casts = [
        'type' => CourseType::class,
    ];

    public function getPhotoAttribute($photo)
    {
        if (isset($photo)) {
            return Image::url($photo);
        } else {
            return asset('images/no-image.png');
        }
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'subject_id');
    }
}
