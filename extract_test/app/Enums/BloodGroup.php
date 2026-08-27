<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static A_Positive()
 * @method static static A_Negative()
 * @method static static B_Positive()
 * @method static static B_Negative()
 * @method static static O_Positive()
 * @method static static O_Negative()
 * @method static static AB_Positive()
 * @method static static AB_Negative()
 * @method static static Unknown()
 */
final class BloodGroup extends Enum
{
    const A_Positive = 0;

    const A_Negative = 1;

    const B_Positive = 2;

    const B_Negative = 3;

    const O_Positive = 4;

    const O_Negative = 5;

    const AB_Positive = 6;

    const AB_Negative = 7;

    const Unknown = 8;

    public function __toString(): string
    {
        return str_replace(['Positive', 'Negative', '_'], ['+', '-', ''], $this->key);
    }
}
