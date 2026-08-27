<?php

namespace App\Models;

use App\Casts\ImageField;
use App\Traits\DeletesImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use DeletesImage, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'name',
        'phone',
        'email',
        'center_id',
        'password',
        'avatar',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'avatar' => ImageField::class.':images/avatar/user,images/avatar.png',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }
}
