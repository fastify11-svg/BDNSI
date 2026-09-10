<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Schema;

class CenterScope implements Scope
{
    protected static $columnCache = [];

    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        $user = auth()->user();
        
        // If auth()->user() is null, try to find an authenticated user across typical guards
        if (! $user) {
            foreach (['web', 'api', 'sanctum'] as $guard) {
                try {
                    if (auth()->guard($guard)->check()) {
                        $user = auth()->guard($guard)->user();
                        break;
                    }
                } catch (\Exception $e) {
                    continue; // Guard might not be configured
                }
            }
        }

        if ($user && $user instanceof \App\Models\User && $user->center_id) {
            $centerId = $user->center_id;

            if ($this->tableHasColumn($model->getTable(), 'center_id')) {
                $builder->where($model->getTable().'.center_id', $centerId);
            } elseif ($this->tableHasColumn($model->getTable(), 'student_id')) {
                $builder->whereHas('student', function ($query) use ($centerId) {
                    $query->where('center_id', $centerId);
                });
            }
        }
    }

    private function tableHasColumn($table, $column)
    {
        $cacheKey = $table.'.'.$column;
        if (! isset(static::$columnCache[$cacheKey])) {
            static::$columnCache[$cacheKey] = Schema::hasColumn($table, $column);
        }

        return static::$columnCache[$cacheKey];
    }
}
