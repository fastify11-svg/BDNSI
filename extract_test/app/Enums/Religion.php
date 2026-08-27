<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Muslim()
 * @method static static Hindu()
 * @method static static Christian()
 * @method static static Buddha()
 * @method static static Other()
 */
final class Religion extends Enum
{
    const Muslim = 0;

    const Hindu = 1;

    const Christian = 2;

    const Buddha = 3;

    const Other = 4;
}
