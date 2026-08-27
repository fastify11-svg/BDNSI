<?php

namespace App\Models;

use App\Casts\ImageField;
use App\Traits\ClearsFrontendCache;
use App\Traits\DeletesImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Team extends Authenticatable
{
    use ClearsFrontendCache, DeletesImage, HasFactory, Notifiable;

    protected $table = 'teams';

    protected $fillable = [
        'name',
        'designation',
        'image',
        'description',
        'status',
        'is_active',

        'email',
        'password',
        'phone',
        'referral_code',
        'facebook_link',
        'twitter_link',
        'linkedin_link',
        'order_index',

        'bn_name',
        'ar_name',
        'bn_designation',
        'ar_designation',
        'bn_description',
        'ar_description',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'image' => ImageField::class . ':team,images',
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($team) {
            if (empty($team->referral_code)) {
                $code = 'STF-' . strtoupper(Str::random(6));
                while (static::where('referral_code', $code)->exists()) {
                    $code = 'STF-' . strtoupper(Str::random(6));
                }
                $team->referral_code = $code;
            }
        });
    }

    public function salesTargets()
    {
        return $this->hasMany(TeamSalesTarget::class, 'team_id');
    }

    public function centers()
    {
        return $this->hasMany(Center::class, 'team_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'team_id');
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'team_id');
    }

    public function sessions()
    {
        return $this->hasMany(Session::class, 'team_id');
    }
}
