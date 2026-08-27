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

use Illuminate\Notifications\Notifiable;

class Center extends Model
{
    use \App\Traits\ClearsFrontendCache, DeletesImage, HasFactory, Notifiable;

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
        'credit_enabled',
        'credit_limit',
        'current_due',
        'allow_registration_without_payment',
        'allow_result_without_payment',
        'allow_certificate_without_payment',
        'auto_restriction',
    ];

    protected $casts = [
        'gender' => Gender::class,
        'religion' => Religion::class,
        'status' => CenterStatus::class,
        'credit_enabled' => 'boolean',
        'allow_registration_without_payment' => 'boolean',
        'allow_result_without_payment' => 'boolean',
        'allow_certificate_without_payment' => 'boolean',
        'auto_restriction' => 'boolean',
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

    public function prices()
    {
        return $this->hasMany(Price::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function ledgers()
    {
        return $this->hasMany(CenterLedger::class);
    }

    public function getAvailableCreditAttribute()
    {
        if (!$this->credit_enabled) {
            return 0;
        }
        return max(0, $this->credit_limit - $this->current_due);
    }

    public function hasSufficientCredit($amount)
    {
        if (!$this->credit_enabled) {
            return false;
        }
        return ($this->current_due + $amount) <= $this->credit_limit;
    }

    /**
     * Get the financial due classification of the center.
     */
    public function getDueClassificationAttribute(): string
    {
        if ($this->current_due <= 0) {
            return 'CLEAR';
        }

        if (!$this->credit_enabled) {
            return 'PAYMENT_DUE';
        }

        if ($this->current_due >= $this->credit_limit) {
            return 'CREDIT_LIMIT_REACHED';
        }

        $utilization = $this->current_due / $this->credit_limit;

        if ($utilization >= 0.8) {
            return 'CREDIT_LIMIT_WARNING';
        }

        return 'CREDIT_ACTIVE';
    }
}
