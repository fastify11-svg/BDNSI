<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Slider()
 * @method static static Gallery()
 * @method static static Sponsor()
 */
final class SliderType extends Enum
{
    const Slider = 0;

    const Gallery = 1;

    const Sponsor = 3;
}
