<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamSalesTarget extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'target_date',
        'student_target',
        'b2b_certificate_target'
    ];

    protected $casts = [
        'target_date' => 'date',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
