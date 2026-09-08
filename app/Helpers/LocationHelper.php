<?php

namespace App\Helpers;

use App\Models\District;
use App\Models\Division;
use App\Models\Upazila;
use Illuminate\Support\Facades\Cache;

class LocationHelper
{
    public static function getDivisions()
    {
        return Cache::rememberForever('locations.divisions', function () {
            return Division::get();
        });
    }

    public static function getDistricts()
    {
        return Cache::rememberForever('locations.districts', function () {
            return District::get();
        });
    }

    public static function getUpazilas()
    {
        return Cache::rememberForever('locations.upazilas', function () {
            return Upazila::get();
        });
    }

    public static function getDistrictsGroupedByDivision()
    {
        return Cache::rememberForever('locations.districts_grouped', function () {
            return District::get()->mapWithKeys(function ($district) {
                return [$district->id => [
                    'id' => $district->id,
                    'name' => $district->name,
                    'division_id' => $district->division_id,
                ]];
            });
        });
    }

    public static function getUpazilasGroupedByDistrict()
    {
        return Cache::rememberForever('locations.upazilas_grouped', function () {
            return Upazila::get()->mapWithKeys(function ($upazila) {
                return [$upazila->id => [
                    'id' => $upazila->id,
                    'name' => $upazila->name,
                    'district_id' => $upazila->district_id,
                ]];
            });
        });
    }
}
