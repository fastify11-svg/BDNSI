<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionPolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'value',
        'team_id',
        'product_type',
        'is_active',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->type = $model->type ?? 'percentage';
            $model->value = $model->value ?? 10;
            $model->name = $model->name ?? 'Default Commission';
        });
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
