<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Created()
 * @method static static Start_Exam()
 * @method static static End_Exam()
 */
final class ExamStatus extends Enum
{
    const Created = 0;

    const Start_Exam = 1;

    const End_Exam = 2;

    const Publish_Result = 4;
}
