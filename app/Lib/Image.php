<?php

namespace App\Lib;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class Image
{
    /**
     * MIME -> storage extension allowlist.
     * Client-provided extensions are never authoritative.
     */
    private const MIME_EXTENSIONS = [
        'image/jpeg' => 'jpg',
        'image/pjpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
        'image/svg+xml' => 'svg',
        'image/x-icon' => 'ico',
        'image/vnd.microsoft.icon' => 'ico',
        'application/pdf' => 'pdf',
    ];

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
        if (! $file) {
            throw new InvalidArgumentException('No upload file provided.');
        }

        $mime = (string) ($file->getMimeType() ?: '');
        $extension = self::extensionForMime($mime);

        // Exclude SVGs, GIFs, ICOs, PDFs, and non-raster files from Intervention compression
        if (in_array($extension, ['svg', 'pdf', 'ico', 'gif'], true) || ! str_starts_with($mime, 'image/')) {
            $safeName = self::safeStorageName($name, $extension);
            $path = $file->storeAs('public/'.$uploadPath, $safeName, ['visibility' => 'public']);

            return str_replace('\\', '/', $path);
        }

        $filename = self::safeStorageName($name, $extension);
        $path = 'public/'.$uploadPath.'/'.$filename;

        try {
            $image = \Intervention\Image\Facades\Image::make($file->getRealPath());

            $image->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $encoded = $image->encode($extension === 'jpg' ? 'jpg' : $extension, 80);

            Storage::put($path, (string) $encoded, 'public');

            return str_replace('\\', '/', $path);
        } catch (\Exception $e) {
            $safeName = self::safeStorageName($name, $extension);
            $path = $file->storeAs('public/'.$uploadPath, $safeName, ['visibility' => 'public']);

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

    private static function extensionForMime(string $mime): string
    {
        if (! isset(self::MIME_EXTENSIONS[$mime])) {
            throw new InvalidArgumentException('Unsupported or spoofed upload MIME type: '.$mime);
        }

        return self::MIME_EXTENSIONS[$mime];
    }

    private static function safeStorageName(?string $name, string $extension): string
    {
        if ($name === null || $name === '') {
            return uniqid('', true).'_'.time().'.'.$extension;
        }

        $base = pathinfo($name, PATHINFO_FILENAME);
        $base = preg_replace('/[^A-Za-z0-9._-]/', '_', (string) $base) ?: 'upload';

        return $base.'.'.$extension;
    }
}
