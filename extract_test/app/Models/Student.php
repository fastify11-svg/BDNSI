<?php

namespace App\Models;

use App\Casts\ImageField;
use App\Enums\BloodGroup;
use App\Enums\CourseType;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Enums\StudentStatus;
use App\Scopes\CenterScope;
use App\Traits\BelongsToStaff;
use App\Traits\DeletesImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property Center center
 * @property Session session
 * @property Subject subject
 * @property Result result
 * @property int center_id
 * @property string name
 * @property string fathers_name
 * @property string mothers_name
 * @property string roll
 * @property string registration
 * @property Carbon date_of_birth
 * @property Gender gender
 * @property BloodGroup blood_group
 * @property Religion religion
 * @property string present_address
 * @property string permanent_address
 * @property string phone
 * @property string email
 * @property string guardian_name
 * @property string nid_or_birth
 * @property int session_id
 * @property int subject_id
 * @property string picture
 * @property StudentStatus status
 */
class Student extends Authenticatable
{
    use \App\Traits\ClearsFrontendCache, \App\Traits\Student\HasGrades, BelongsToStaff, DeletesImage, HasFactory;

    protected static function booted()
    {
        static::addGlobalScope(new CenterScope);
    }

    protected $fillable = [
        'center_id',
        'name',
        'fathers_name',
        'mothers_name',
        'roll',
        'registration',
        'passport',
        'date_of_birth',
        'gender',
        'blood_group',
        'religion',
        'present_address',
        'permanent_address',
        'phone',
        'email',
        'guardian_name',
        'nid_or_birth',
        'session_id',
        'subject_id',
        'course_duration',
        'picture',
        'status',
        'exam_date',
        'result_publised',
        'due_amount',
        'paid_amount',
        'payment_status',
        'qualification',
        'course_type',
        'team_id',
        'password',
        'remember_token',
    ];

    protected $casts = [
        'result_publised' => 'datetime',
        'blood_group' => BloodGroup::class,
        'gender' => Gender::class,
        'religion' => Religion::class,
        'status' => StudentStatus::class,
        'course_type' => CourseType::class,
        'picture' => ImageField::class.':images/students',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function result()
    {
        return $this->hasOne(Result::class);
    }

    public function semesterResults()
    {
        return $this->hasMany(SemesterResult::class);
    }

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'payable');
    }

    public function scopeOwn($query, $centerId = null)
    {
        $centerId = $centerId ?? Auth::user()->center_id;

        return $query->where(['center_id' => $centerId]);
    }

    public static function getLastFreeRoll()
    {
        $lastStudent = static::orderBy('id', 'desc')->first();
        $lastRoll = $lastStudent && is_numeric($lastStudent->roll) ? (int) $lastStudent->roll : 100000;

        return str_pad($lastRoll + 1, 6, '0', STR_PAD_LEFT);
    }

    public static function getLastFreeRegistration()
    {
        $lastStudent = static::orderBy('id', 'desc')->first();
        $lastReg = $lastStudent && is_numeric($lastStudent->registration) ? (int) $lastStudent->registration : 1000000000;

        return str_pad($lastReg + 1, 10, '0', STR_PAD_LEFT);
    }

    public function scopeHide($query)
    {
        return $query->whereNotIn('status', [StudentStatus::Hide]);
    }
}
