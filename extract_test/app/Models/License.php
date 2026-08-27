<?php

namespace App\Models;

use App\Casts\ImageField;
use App\Traits\DeletesImage;
use Illuminate\Database\Eloquent\Model;

class License extends Model
{
    use DeletesImage;

    protected $fillable = [
        'cnic',
        'name',
        'father_name',
        'city',
        'state',
        'image',
        'license_number',
        'issue_date',
        'valid_from',
        'valid_to',
        'credential_type',
    ];

    protected $casts = [
        'issue_date' => 'datetime',
        'valid_from' => 'datetime',
        'valid_to'   => 'datetime',
        'image'      => ImageField::class.':license,images/no-image.png',
        // credential_type is stored as plain string — no JSON cast needed
    ];

    /**
     * Returns a list of available credential types for vocational certificates.
     */
    public static function getCredentialTypes(): array
    {
        return [
            'Vocational Certificate'    => 'Vocational Certificate',
            'Professional Diploma'      => 'Professional Diploma',
            'Completion Certificate'    => 'Completion Certificate',
            'Short Course Certificate'  => 'Short Course Certificate',
        ];
    }
}
