<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Requested()
 * @method static static Approved()
 * @method static static Hide()
 */
final class StudentStatus extends Enum
{
    const Pending = 0;

    const Requested = 1;

    const Approved = 2;

    const Hide = 3;

    const Active = 4;

    const Completed = 5;

    const Cancelled = 6;

    const Rejected = 7;

    public static function getStatus()
    {
        return [
            'Pending' => 0,
            'Requested' => 1,
            'Approved' => 2,
            'Hide' => 3,
            'Active' => 4,
            'Completed' => 5,
            'Cancelled' => 6,
            'Rejected' => 7,
        ];
    }
}
