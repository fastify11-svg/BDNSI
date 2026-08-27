<?php

namespace App\Models;

use App\Traits\ClearsFrontendCache;
use Illuminate\Database\Eloquent\Model;

class YoutubeVideo extends Model
{
    use ClearsFrontendCache;

    protected $fillable = [
        'title',
        'image',
        'description',
        'link',
        'status',
        'video_id',
    ];
}
