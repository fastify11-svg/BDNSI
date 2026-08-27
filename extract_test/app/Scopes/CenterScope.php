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
        if (auth()->guard('web')->check() && auth()->guard('web')->user()->center_id) {
            $centerId = auth()->guard('web')->user()->center_id;

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
