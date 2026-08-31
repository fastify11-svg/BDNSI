<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'source',
        'team_id',
        'center_id',
        'status',
        'notes',
        'follow_up_date',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function center()
    {
        return $this->belongsTo(Center::class);
    }
}
