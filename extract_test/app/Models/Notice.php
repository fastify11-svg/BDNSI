<?php

namespace App\Models;

use App\Casts\ImageField;
use App\Traits\DeletesImage;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use \App\Traits\ClearsFrontendCache, DeletesImage;

    protected $fillable = [
        'title',
        'details',
        'image',
        'file_path',
        'bn_details',
        'ar_details',
    ];

    protected $casts = [
        'image' => ImageField::class.':avatar,images/avatar.png',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}
