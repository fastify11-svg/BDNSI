<?php

namespace App\Casts;

use App\Lib\Image;
use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class ImageField implements Castable, CastsAttributes
{
    protected $path;

    protected $fallbackImage;

    public function __construct(?string $path = null, ?string $fallbackImage = null)
    {
        $this->path = $path ?? 'images';
        $this->fallbackImage = $fallbackImage ?? 'images/no-image.png';
    }

    /**
     * Cast the given value.
     *
     * @param  Model  $model
     * @param  mixed  $value
     * @return mixed
     */
    public function get($model, string $key, $value, array $attributes)
    {
        return $value ? Image::url($value) : asset($this->fallbackImage);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  Model  $model
     * @param  mixed  $value
     * @return mixed
     */
    public function set($model, string $key, $value, array $attributes)
    {
        if (isset($attributes[$key]) && $attributes[$key]) {
            Image::delete($attributes[$key]);
        }

        return Image::storeFile($value, $this->path);
    }

    public static function castUsing(array $arguments)
    {
        return new self($arguments[0] ?? null, $arguments[1] ?? null);
    }
}
