<?php

use App\Models\Translation;
use Illuminate\Support\Facades\App;

if (! function_exists('__t')) {
    function __t($key)
    {
        $locale = App::getLocale();
        $translation = Translation::where('key', $key)->first();

        return $translation ? $translation->$locale : $key;
    }

}

if (! function_exists('translateField')) {
    function translateField($model, $field)
    {

        $locale = App::getLocale();
        $localizedField = $locale === 'bn'
            ? "bn_{$field}"
            : ($locale === 'ar' ? "ar_{$field}" : $field);

        return $model->{$localizedField} ?? $model->{$field};
    }
}
