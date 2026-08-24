<?php

namespace App\Models;

use App\Casts\ImageField;
use App\Enums\CenterStatus;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Enums\StudentStatus;
use App\Lib\Image;
use App\Traits\DeletesImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Center extends Model
{
    use \App\Traits\ClearsFrontendCache, DeletesImage, HasFactory;

    protected $fillable = [
        'code',
        'name',
        'owner_name',
        'director_name',
        'director_image',
        'fathers_name',
        'mothers_name',
        'religion',
        'gender',
        'division',
        'district',
        'upazilla',
        'post_office',
        'address',
        'center_location',
        'center_logo',
        'director_photo',
        'director_signature',
        'mobile',
        'email',
        'photo',
        'authority_signature',
        'nid_photo',
        'nid_back_photo',
        'status',
        'team_id',
    ];

    protected $casts = [
        'gender' => Gender::class,
        'religion' => Religion::class,
        'status' => CenterStatus::class,
        'photo' => ImageField::class.':center/photo',
        'director_image' => ImageField::class.':center/photo',
        'director_photo' => ImageField::class.':center/photo',
        'center_logo' => ImageField::class.':center/logo',
        'authority_signature' => ImageField::class.':center/authority_signature',
        'director_signature' => ImageField::class.':center/authority_signature',
        'nid_photo' => ImageField::class.':center/nid_photo',
        'nid_back_photo' => ImageField::class.':center/nid_photo',
    ];

    public function students()
    {
        return $this->hasMany(Student::class, 'center_id')->where('status', StudentStatus::Approved);
    }

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function allStudents()
    {
        return $this->hasMany(Student::class, 'center_id');
    }

    public function getPhotoAttribute($photo)
    {
        if (isset($photo)) {
            return Image::url($photo);
        } else {
            return asset('images/avatar.png');
        }

    }

    public function getCodeAttribute()
    {
        if (isset($this->attributes['code']) && ! empty($this->attributes['code'])) {
            return $this->attributes['code'];
        }

        return isset($this->attributes['id']) ? str_pad($this->attributes['id'], 6, '178', STR_PAD_LEFT) : null;
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'payable');
    }
}
