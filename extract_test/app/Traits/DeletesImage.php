<?php

namespace App\Traits;

use App\Lib\Image;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static deleting(\Closure $param)
 */
trait DeletesImage
{
    protected static function booted()
    {
        static::deleting(function (Model $model) {
            $imageFields = array_keys(
                array_filter($model->getCasts(), function ($cast) {
                    return str_contains($cast, 'ImageField');
                })
            );
            foreach ($imageFields as $field) {
                Image::delete($model, $field);
            }
        });
    }
}
