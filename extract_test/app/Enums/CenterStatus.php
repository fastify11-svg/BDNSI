<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Approved()
 */
final class CenterStatus extends Enum
{
    const Pending = 0;

    const Approved = 1;

    const Suspended = 2;
}
