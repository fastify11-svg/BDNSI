<?php

namespace App\Lib;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Image
{
    public static function delete($model, $attribute = null)
    {
        if ($model instanceof Model && $attribute) {
            $image = $model->getRawOriginal($attribute);
        } else {
            $image = $model;
        }

        if (Storage::exists($image)) {
            Storage::delete($image);
        }
    }

    public static function store($requestKey, $uploadPath, $name = null)
    {
        return self::storeFile(request()->file($requestKey), $uploadPath, $name);
    }

    public static function storeFile($file, $uploadPath, $name = null)
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $mime = $file->getMimeType();

        // Exclude SVGs, GIFs, ICOs, and non-image files from Intervention compression
        if (in_array($extension, ['svg', 'pdf', 'ico', 'gif']) || ! str_starts_with($mime, 'image/')) {
            if (is_null($name)) {
                $path = $file->store('public/'.$uploadPath, ['visibility' => 'public']);
            } else {
                $path = $file->storeAs('public/'.$uploadPath, $name, ['visibility' => 'public']);
            }

            return str_replace('\\', '/', $path);
        }

        $filename = $name ?? uniqid().'_'.time().'.'.$extension;
        $path = 'public/'.$uploadPath.'/'.$filename;

        try {
            // Open file using Intervention Image
            $image = \Intervention\Image\Facades\Image::make($file->getRealPath());

            // Resize if width is greater than 1200px, keeping aspect ratio
            $image->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            // Encode the image at 80% quality
            $encoded = $image->encode($extension, 80);

            // Put to storage
            Storage::put($path, (string) $encoded, 'public');

            return str_replace('\\', '/', $path);
        } catch (\Exception $e) {
            // Fallback to normal upload if Intervention fails
            if (is_null($name)) {
                $path = $file->store('public/'.$uploadPath, ['visibility' => 'public']);
            } else {
                $path = $file->storeAs('public/'.$uploadPath, $name, ['visibility' => 'public']);
            }

            return str_replace('\\', '/', $path);
        }
    }

    public static function url($model, $attribute = null)
    {
        if ($model instanceof Model && $attribute) {
            $image = $model->getRawOriginal($attribute);
        } else {
            $image = $model;
        }

        if (empty($image)) {
            return asset('images/no-image.png');
        }

        $path = preg_replace("/^public\\\?\/?/", '', $image);

        return asset(Storage::url($path));
    }
}
