<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = [
        'division_id',
        'name',

    ];

    public static function getDistrictIdByName($name)
    {

        $districts = District::get();
        foreach ($districts as $district) {
            if ($district->name === $name) {
                return $district->id;
            }
        }

        return null;

    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'division_id');
    }
}
