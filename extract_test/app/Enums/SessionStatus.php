<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Active()
 * @method static static Pending()
 */
final class SessionStatus extends Enum
{
    const Pending = 0;

    const Active = 1;
}
