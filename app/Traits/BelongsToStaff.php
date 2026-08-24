<?php

namespace App\Traits;

use App\Models\Team;
use App\Scopes\StaffScope;

trait BelongsToStaff
{
    /**
     * Boot the trait to attach StaffScope.
     */
    public static function bootBelongsToStaff()
    {
        static::addGlobalScope(new StaffScope);

        // Auto-assign team_id on model creation if authenticated as staff
        static::creating(function ($model) {
            if (auth()->guard('staff')->check() && auth()->guard('staff')->id()) {
                if (empty($model->team_id)) {
                    $model->team_id = auth()->guard('staff')->id();
                }
            }
        });
    }

    /**
     * Staff/Team relationship.
     */
    public function staff()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    /**
     * Team alias relationship.
     */
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    /**
     * Scope for a specific staff/team ID.
     */
    public function scopeForStaff($query, $staffId)
    {
        return $query->where('team_id', $staffId);
    }
}
