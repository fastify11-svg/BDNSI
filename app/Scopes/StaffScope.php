<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Schema;

class StaffScope implements Scope
{
    protected static $columnCache = [];

    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        // Strictly apply when authenticated via 'staff' guard
        if (auth()->guard('staff')->check() && auth()->guard('staff')->user()) {
            $staffId = auth()->guard('staff')->id();

            if ($this->tableHasColumn($model->getTable(), 'team_id')) {
                $builder->where($model->getTable() . '.team_id', $staffId);
            } elseif ($this->tableHasColumn($model->getTable(), 'staff_id')) {
                $builder->where($model->getTable() . '.staff_id', $staffId);
            } elseif ($this->tableHasColumn($model->getTable(), 'student_id')) {
                $builder->whereHas('student', function ($query) use ($staffId) {
                    $query->where('team_id', $staffId);
                });
            }
        }
        // When auth('admin')->check(), this scope does not apply, giving Super Admin full monitoring.
    }

    private function tableHasColumn($table, $column)
    {
        $cacheKey = $table . '.' . $column;
        if (!isset(static::$columnCache[$cacheKey])) {
            static::$columnCache[$cacheKey] = Schema::hasColumn($table, $column);
        }

        return static::$columnCache[$cacheKey];
    }
}
