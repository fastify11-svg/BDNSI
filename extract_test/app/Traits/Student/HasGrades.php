<?php

namespace App\Traits\Student;

use App\Enums\CourseType;

trait HasGrades
{
    public function written($marks = 0)
    {
        $marks = $this->result->written;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return 'A+';
                case $marks >= 70:
                    return 'A';
                case $marks >= 60:
                    return 'A-';
                case $marks >= 50:
                    return 'B';
                case $marks >= 40:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 800:
                    return 'A+';
                case $marks >= 750:
                    return 'A';
                case $marks >= 700:
                    return 'A-';
                case $marks >= 650:
                    return 'B';
                case $marks >= 600:
                    return 'B+';
                case $marks >= 550:
                    return 'B-';
                case $marks >= 500:
                    return 'C+';
                case $marks >= 450:
                    return 'C';
                case $marks >= 400:
                    return 'D';
                case $marks >= 0:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 3040:
                    return 'A+';
                case $marks >= 2850:
                    return 'A';
                case $marks >= 2660:
                    return 'A-';
                case $marks >= 2470:
                    return 'B+';
                case $marks >= 2280:
                    return 'B';
                case $marks >= 2090:
                    return 'B-';
                case $marks >= 1900:
                    return 'C+';
                case $marks >= 1710:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';
        }
    }

    public function viva($marks = 0)
    {
        $marks = $this->result->viva;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return 'A+';
                case $marks >= 70:
                    return 'A';
                case $marks >= 60:
                    return 'A-';
                case $marks >= 50:
                    return 'B';
                case $marks >= 40:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return '';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return 'A+';
                case $marks >= 75 && $marks < 80:
                    return 'A';
                case $marks >= 70 && $marks < 75:
                    return 'A-';
                case $marks >= 65 && $marks < 70:
                    return 'B';
                case $marks >= 60 && $marks < 65:
                    return 'B+';
                case $marks >= 55 && $marks < 60:
                    return 'B-';
                case $marks >= 50 && $marks < 55:
                    return 'C+';
                case $marks >= 45 && $marks < 50:
                    return 'C';
                case $marks >= 40 && $marks < 45:
                    return 'D';
                case $marks >= 0 && $marks < 40:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return 'A+';
                case $marks >= 375 && $marks < 400:
                    return 'A';
                case $marks >= 350 && $marks < 375:
                    return 'A-';
                case $marks >= 325 && $marks < 350:
                    return 'B';
                case $marks >= 300 && $marks < 325:
                    return 'B+';
                case $marks >= 275 && $marks < 300:
                    return 'B-';
                case $marks >= 250 && $marks < 275:
                    return 'C+';
                case $marks >= 225 && $marks < 250:
                    return 'C';
                case $marks >= 200 && $marks < 225:
                    return 'D';
                case $marks >= 0 && $marks < 200:
                    return 'F';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';
        }
    }

    public function practical($marks = 0)
    {
        $marks = $this->result->practical;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return 'A+';
                case $marks >= 70:
                    return 'A';
                case $marks >= 60:
                    return 'A-';
                case $marks >= 50:
                    return 'B';
                case $marks >= 40:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return '';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return 'A+';
                case $marks >= 75 && $marks < 80:
                    return 'A';
                case $marks >= 70 && $marks < 75:
                    return 'A-';
                case $marks >= 65 && $marks < 70:
                    return 'B';
                case $marks >= 60 && $marks < 65:
                    return 'B+';
                case $marks >= 55 && $marks < 60:
                    return 'B-';
                case $marks >= 50 && $marks < 55:
                    return 'C+';
                case $marks >= 45 && $marks < 50:
                    return 'C';
                case $marks >= 40 && $marks < 45:
                    return 'D';
                case $marks >= 0 && $marks < 40:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return 'A+';
                case $marks >= 375 && $marks < 400:
                    return 'A';
                case $marks >= 350 && $marks < 375:
                    return 'A-';
                case $marks >= 325 && $marks < 350:
                    return 'B';
                case $marks >= 300 && $marks < 325:
                    return 'B+';
                case $marks >= 275 && $marks < 300:
                    return 'B-';
                case $marks >= 250 && $marks < 275:
                    return 'C+';
                case $marks >= 225 && $marks < 250:
                    return 'C';
                case $marks >= 200 && $marks < 225:
                    return 'D';
                case $marks >= 0 && $marks < 200:
                    return 'F';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';

        }
    }

    public function writtenResult($marks = 0)
    {
        $marks = $this->result->written;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return 'A+';
                case $marks >= 70:
                    return 'A';
                case $marks >= 60:
                    return 'A-';
                case $marks >= 50:
                    return 'B';
                case $marks >= 40:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 800:
                    return 'A+';
                case $marks >= 750:
                    return 'A';
                case $marks >= 700:
                    return 'A-';
                case $marks >= 650:
                    return 'B';
                case $marks >= 600:
                    return 'B+';
                case $marks >= 550:
                    return 'B-';
                case $marks >= 500:
                    return 'C+';
                case $marks >= 450:
                    return 'C';
                case $marks >= 400:
                    return 'D';
                case $marks >= 0:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {

            switch (true) {
                case $marks >= 3040:
                    return 'A+';
                case $marks >= 2850:
                    return 'A';
                case $marks >= 2660:
                    return 'A-';
                case $marks >= 2470:
                    return 'B+';
                case $marks >= 2280:
                    return 'B';
                case $marks >= 2090:
                    return 'B-';
                case $marks >= 1900:
                    return 'C+';
                case $marks >= 1710:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';
        }
    }

    public function vivaResult($marks = 0)
    {
        $marks = $this->result->viva;

        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return 'A+';
                case $marks >= 70:
                    return 'A';
                case $marks >= 60:
                    return 'A-';
                case $marks >= 50:
                    return 'B';
                case $marks >= 40:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return '';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return 'A+';
                case $marks >= 75 && $marks < 80:
                    return 'A';
                case $marks >= 70 && $marks < 75:
                    return 'A-';
                case $marks >= 65 && $marks < 70:
                    return 'B';
                case $marks >= 60 && $marks < 65:
                    return 'B+';
                case $marks >= 55 && $marks < 60:
                    return 'B-';
                case $marks >= 50 && $marks < 55:
                    return 'C+';
                case $marks >= 45 && $marks < 50:
                    return 'C';
                case $marks >= 40 && $marks < 45:
                    return 'D';
                case $marks >= 0 && $marks < 40:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {

            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return 'A+';
                case $marks >= 375 && $marks < 400:
                    return 'A';
                case $marks >= 350 && $marks < 375:
                    return 'A-';
                case $marks >= 325 && $marks < 350:
                    return 'B';
                case $marks >= 300 && $marks < 325:
                    return 'B+';
                case $marks >= 275 && $marks < 300:
                    return 'B-';
                case $marks >= 250 && $marks < 275:
                    return 'C+';
                case $marks >= 225 && $marks < 250:
                    return 'C';
                case $marks >= 200 && $marks < 225:
                    return 'D';
                case $marks >= 0 && $marks < 200:
                    return 'F';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';
        }
    }

    public function practicalResult($marks = 0)
    {
        $marks = $this->result->practical;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return 'A+';
                case $marks >= 70:
                    return 'A';
                case $marks >= 60:
                    return 'A-';
                case $marks >= 50:
                    return 'B';
                case $marks >= 40:
                    return 'C';
                case $marks >= 0:
                    return 'F';
                default:
                    return '';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return 'A+';
                case $marks >= 75 && $marks < 80:
                    return 'A';
                case $marks >= 70 && $marks < 75:
                    return 'A-';
                case $marks >= 65 && $marks < 70:
                    return 'B';
                case $marks >= 60 && $marks < 65:
                    return 'B+';
                case $marks >= 55 && $marks < 60:
                    return 'B-';
                case $marks >= 50 && $marks < 55:
                    return 'C+';
                case $marks >= 45 && $marks < 50:
                    return 'C';
                case $marks >= 40 && $marks < 45:
                    return 'D';
                case $marks >= 0 && $marks < 40:
                    return 'F';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return 'A+';
                case $marks >= 375 && $marks < 400:
                    return 'A';
                case $marks >= 350 && $marks < 375:
                    return 'A-';
                case $marks >= 325 && $marks < 350:
                    return 'B';
                case $marks >= 300 && $marks < 325:
                    return 'B+';
                case $marks >= 275 && $marks < 300:
                    return 'B-';
                case $marks >= 250 && $marks < 275:
                    return 'C+';
                case $marks >= 225 && $marks < 250:
                    return 'C';
                case $marks >= 200 && $marks < 225:
                    return 'D';
                case $marks >= 0 && $marks < 200:
                    return 'F';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';

        }
    }

    public function gpa()
    {
        $marks = $this->result->written;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return $grade = 'A+';
                case $marks >= 75 && $marks < 80:
                    return $grade = 'A';
                case $marks >= 70 && $marks < 75:
                    return $grade = 'A-';
                case $marks >= 65 && $marks < 70:
                    return $grade = 'B';
                case $marks >= 60 && $marks < 65:
                    return $grade = 'B+';
                case $marks >= 55 && $marks < 60:
                    return $grade = 'B-';
                case $marks >= 50 && $marks < 55:
                    return $grade = 'C+';
                case $marks >= 45 && $marks < 50:
                    return $grade = 'C';
                case $marks >= 40 && $marks < 45:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 40:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 800 && $marks <= 1000:
                    return $grade = 'A+';
                case $marks >= 750 && $marks < 800:
                    return $grade = 'A';
                case $marks >= 700 && $marks < 750:
                    return $grade = 'A-';
                case $marks >= 650 && $marks < 700:
                    return $grade = 'B';
                case $marks >= 600 && $marks < 650:
                    return $grade = 'B+';
                case $marks >= 550 && $marks < 600:
                    return $grade = 'B-';
                case $marks >= 500 && $marks < 550:
                    return $grade = 'C+';
                case $marks >= 450 && $marks < 500:
                    return $grade = 'C';
                case $marks >= 400 && $marks < 450:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 400:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {

            switch (true) {
                case $marks >= 3040 && $marks <= 3800:
                    return $grade = 'A+';
                case $marks >= 2850 && $marks < 3040:
                    return $grade = 'A';
                case $marks >= 2660 && $marks < 2850:
                    return $grade = 'A-';
                case $marks >= 2470 && $marks < 2660:
                    return $grade = 'B';
                case $marks >= 2280 && $marks < 2470:
                    return $grade = 'B+';
                case $marks >= 2090 && $marks < 2280:
                    return $grade = 'B-';
                case $marks >= 1900 && $marks < 2090:
                    return $grade = 'C+';
                case $marks >= 1710 && $marks < 1900:
                    return $grade = 'C';
                case $marks >= 1520 && $marks < 1710:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 1520:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';
        }

    }

    public function gpaViva($marks = 0)
    {
        $marks = $this->result->viva;

        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 80:
                    return '4.00';
                case $marks >= 70:
                    return '3.75';
                case $marks >= 60:
                    return '3.50';
                case $marks >= 50:
                    return '3.00';
                case $marks >= 40:
                    return '2.00';
                case $marks >= 0:
                    return '0.00';
                default:
                    return '';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 800:
                    return '4.00';
                case $marks >= 750:
                    return '3.75';
                case $marks >= 700:
                    return '3.50';
                case $marks >= 650:
                    return '3.25';
                case $marks >= 600:
                    return '3.00';
                case $marks >= 550:
                    return '2.75';
                case $marks >= 500:
                    return '2.50';
                case $marks >= 450:
                    return '2.25';
                case $marks >= 400:
                    return '2.00';
                case $marks >= 0:
                    return '0.00';
                default:
                    return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 3040:
                    return '4.00';
                case $marks >= 2850:
                    return '3.75';
                case $marks >= 2660:
                    return '3.50';
                case $marks >= 2470:
                    return '3.25';
                case $marks >= 2280:
                    return '3.00';
                case $marks >= 2090:
                    return '2.75';
                case $marks >= 1900:
                    return '2.50';
                case $marks >= 1710:
                    return '2.25';
                case $marks >= 1520:
                    return '2.00';
                case $marks >= 0:
                    return '0.00';
                default:
                    return 'N/A';
            }
        } else {
            return 'N/A';
        }
    }

    public function gpaPractical($marks = 0)
    {
        $marks = $this->result->practical;

        if ($this->course_type->is(CourseType::Regular())) {
            if ($marks >= 80) {
                return '4.00';
            } elseif ($marks >= 70) {
                return '3.75';
            } elseif ($marks >= 60) {
                return '3.50';
            } elseif ($marks >= 50) {
                return '3.00';
            } elseif ($marks >= 40) {
                return '2.00';
            } elseif ($marks >= 0) {
                return '0.00';
            } else {
                return '';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            if ($marks >= 800) {
                return '4.00';
            } elseif ($marks >= 750) {
                return '3.75';
            } elseif ($marks >= 700) {
                return '3.50';
            } elseif ($marks >= 650) {
                return '3.25';
            } elseif ($marks >= 600) {
                return '3.00';
            } elseif ($marks >= 550) {
                return '2.75';
            } elseif ($marks >= 500) {
                return '2.50';
            } elseif ($marks >= 450) {
                return '2.25';
            } elseif ($marks >= 400) {
                return '2.00';
            } elseif ($marks >= 0) {
                return '0.00';
            } else {
                return 'N/A';
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            if ($marks >= 3040) {
                return '4.00';
            } elseif ($marks >= 2850) {
                return '3.75';
            } elseif ($marks >= 2660) {
                return '3.50';
            } elseif ($marks >= 2470) {
                return '3.25';
            } elseif ($marks >= 2280) {
                return '3.00';
            } elseif ($marks >= 2090) {
                return '2.75';
            } elseif ($marks >= 1900) {
                return '2.50';
            } elseif ($marks >= 1710) {
                return '2.25';
            } elseif ($marks >= 1520) {
                return '2.00';
            } elseif ($marks >= 0) {
                return '0.00';
            } else {
                return 'N/A';
            }
        } else {
            return 'N/A';
        }
    }

    public function t_written()
    {
        $marks = $this->result->written;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 65 && $marks <= 70:
                    return 'A+';
                case $marks >= 60 && $marks < 65:
                    return 'A';
                case $marks >= 55 && $marks < 60:
                    return 'A-';
                case $marks >= 50 && $marks < 55:
                    return 'B';
                case $marks >= 45 && $marks < 50:
                    return 'B+';
                case $marks >= 40 && $marks < 45:
                    return 'B-';
                case $marks >= 35 && $marks < 40:
                    return 'C+';
                case $marks >= 30 && $marks < 35:
                    return 'C';
                case $marks >= 25 && $marks < 30:
                    return 'D';
                case $marks >= 0 && $marks < 25:
                    return 'F';
                default:
                    return 'Invalid'; // Handle invalid marks input
            }

        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 800 && $marks <= 1000:
                    return $grade = 'A+';
                case $marks >= 750 && $marks < 800:
                    return $grade = 'A';
                case $marks >= 700 && $marks < 750:
                    return $grade = 'A-';
                case $marks >= 650 && $marks < 700:
                    return $grade = 'B';
                case $marks >= 600 && $marks < 650:
                    return $grade = 'B+';
                case $marks >= 550 && $marks < 600:
                    return $grade = 'B-';
                case $marks >= 500 && $marks < 550:
                    return $grade = 'C+';
                case $marks >= 450 && $marks < 500:
                    return $grade = 'C';
                case $marks >= 400 && $marks < 450:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 400:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {

            switch (true) {
                case $marks >= 3040 && $marks <= 3800:
                    return $grade = 'A+';
                case $marks >= 2850 && $marks < 3040:
                    return $grade = 'A';
                case $marks >= 2660 && $marks < 2850:
                    return $grade = 'A-';
                case $marks >= 2470 && $marks < 2660:
                    return $grade = 'B';
                case $marks >= 2280 && $marks < 2470:
                    return $grade = 'B+';
                case $marks >= 2090 && $marks < 2280:
                    return $grade = 'B-';
                case $marks >= 1900 && $marks < 2090:
                    return $grade = 'C+';
                case $marks >= 1710 && $marks < 1900:
                    return $grade = 'C';
                case $marks >= 1520 && $marks < 1710:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 1520:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';
        }

    }

    public function t_written_gpa()
    {
        $marks = $this->result->written;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 65 && $marks <= 70:
                    return 4.00;
                case $marks >= 60 && $marks < 65:
                    return 3.75;
                case $marks >= 55 && $marks < 60:
                    return 3.50;
                case $marks >= 50 && $marks < 55:
                    return 3.25;
                case $marks >= 45 && $marks < 50:
                    return 3.00;
                case $marks >= 40 && $marks < 45:
                    return 2.75;
                case $marks >= 35 && $marks < 40:
                    return 2.50;
                case $marks >= 30 && $marks < 35:
                    return 2.25;
                case $marks >= 25 && $marks < 30:
                    return 2.00;
                case $marks >= 0 && $marks < 25:
                    return 0.00;
                default:
                    return 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 800 && $marks <= 1000:
                    return $gpa = 4.00;
                case $marks >= 750 && $marks < 800:
                    return $gpa = 3.75;
                case $marks >= 700 && $marks < 750:
                    return $gpa = 3.50;
                case $marks >= 650 && $marks < 700:
                    return $gpa = 3.25;
                case $marks >= 600 && $marks < 650:
                    return $gpa = 3.00;
                case $marks >= 550 && $marks < 600:
                    return $gpa = 2.75;
                case $marks >= 500 && $marks < 550:
                    return $gpa = 2.50;
                case $marks >= 450 && $marks < 500:
                    return $gpa = 2.25;
                case $marks >= 400 && $marks < 450:
                    return $gpa = 2.00;
                case $marks >= 0 && $marks < 400:
                    return $gpa = 0.00;
                default:
                    return $gpa = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {

            switch (true) {
                case $marks >= 3040 && $marks <= 3800:
                    return $gpa = 4.00;
                case $marks >= 2850 && $marks < 3040:
                    return $gpa = 3.75;
                case $marks >= 2660 && $marks < 2850:
                    return $gpa = 3.50;
                case $marks >= 2470 && $marks < 2660:
                    return $gpa = 3.25;
                case $marks >= 2280 && $marks < 2470:
                    return $gpa = 3.00;
                case $marks >= 2090 && $marks < 2280:
                    return $gpa = 2.75;
                case $marks >= 1900 && $marks < 2090:
                    return $gpa = 2.50;
                case $marks >= 1710 && $marks < 1900:
                    return $gpa = 2.25;
                case $marks >= 1520 && $marks < 1710:
                    return $gpa = 2.00;
                case $marks >= 0 && $marks < 1520:
                    return $gpa = 0.00;
                default:
                    return $gpa = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';
        }

    }

    public function t_practical()
    {
        $marks = $this->result->practical;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 18 && $marks <= 20:
                    return 'A+';
                case $marks >= 16 && $marks < 18:
                    return 'A';
                case $marks >= 14 && $marks < 16:
                    return 'A-';
                case $marks >= 12 && $marks < 14:
                    return 'B';
                case $marks >= 10 && $marks < 12:
                    return 'B+';
                case $marks >= 8 && $marks < 10:
                    return 'B-';
                case $marks >= 6 && $marks < 8:
                    return 'C+';
                case $marks >= 4 && $marks < 6:
                    return 'C';
                case $marks >= 2 && $marks < 4:
                    return 'D';
                case $marks >= 0 && $marks < 2:
                    return 'F';
                default:
                    return 'Invalid';
            }
        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return $grade = 'A+';
                case $marks >= 75 && $marks < 80:
                    return $grade = 'A';
                case $marks >= 70 && $marks < 75:
                    return $grade = 'A-';
                case $marks >= 65 && $marks < 70:
                    return $grade = 'B';
                case $marks >= 60 && $marks < 65:
                    return $grade = 'B+';
                case $marks >= 55 && $marks < 60:
                    return $grade = 'B-';
                case $marks >= 50 && $marks < 55:
                    return $grade = 'C+';
                case $marks >= 45 && $marks < 50:
                    return $grade = 'C';
                case $marks >= 40 && $marks < 45:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 40:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return $grade = 'A+';
                case $marks >= 375 && $marks < 400:
                    return $grade = 'A';
                case $marks >= 350 && $marks < 375:
                    return $grade = 'A-';
                case $marks >= 325 && $marks < 350:
                    return $grade = 'B';
                case $marks >= 300 && $marks < 325:
                    return $grade = 'B+';
                case $marks >= 275 && $marks < 300:
                    return $grade = 'B-';
                case $marks >= 250 && $marks < 275:
                    return $grade = 'C+';
                case $marks >= 225 && $marks < 250:
                    return $grade = 'C';
                case $marks >= 200 && $marks < 225:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 200:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';
        }

    }

    public function t_practical_gpa()
    {
        $marks = $this->result->practical;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 16 && $marks <= 20:
                    return 4.00;
                case $marks >= 15 && $marks < 16:
                    return 3.75;
                case $marks >= 14 && $marks < 15:
                    return 3.50;
                case $marks >= 13 && $marks < 14:
                    return 3.25;
                case $marks >= 12 && $marks < 13:
                    return 3.00;
                case $marks >= 11 && $marks < 12:
                    return 2.75;
                case $marks >= 10 && $marks < 11:
                    return 2.50;
                case $marks >= 9 && $marks < 10:
                    return 2.25;
                case $marks >= 8 && $marks < 9:
                    return 2.00;
                case $marks >= 0 && $marks < 8:
                    return 0.00;
                default:
                    return 'Invalid'; // If marks are out of range
            }

        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return $gpa = 4.00;
                case $marks >= 75 && $marks < 80:
                    return $gpa = 3.75;
                case $marks >= 70 && $marks < 75:
                    return $gpa = 3.50;
                case $marks >= 65 && $marks < 70:
                    return $gpa = 3.25;
                case $marks >= 60 && $marks < 65:
                    return $gpa = 3.00;
                case $marks >= 55 && $marks < 60:
                    return $gpa = 2.75;
                case $marks >= 50 && $marks < 55:
                    return $gpa = 2.50;
                case $marks >= 45 && $marks < 50:
                    return $gpa = 2.25;
                case $marks >= 40 && $marks < 45:
                    return $gpa = 2.00;
                case $marks >= 0 && $marks < 40:
                    return $gpa = 0.00;
                default:
                    return $gpa = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return $gpa = 4.00;
                case $marks >= 375 && $marks < 400:
                    return $gpa = 3.75;
                case $marks >= 350 && $marks < 375:
                    return $gpa = 3.50;
                case $marks >= 325 && $marks < 350:
                    return $gpa = 3.25;
                case $marks >= 300 && $marks < 325:
                    return $gpa = 3.00;
                case $marks >= 275 && $marks < 300:
                    return $gpa = 2.75;
                case $marks >= 250 && $marks < 275:
                    return $gpa = 2.50;
                case $marks >= 225 && $marks < 250:
                    return $gpa = 2.25;
                case $marks >= 200 && $marks < 225:
                    return $gpa = 2.00;
                case $marks >= 0 && $marks < 200:
                    return $gpa = 0.00;
                default:
                    return $gpa = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';
        }

    }

    public function t_viva()
    {
        $marks = $this->result->viva;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 9 && $marks <= 10:
                    return 'A+';
                case $marks >= 8 && $marks < 9:
                    return 'A';
                case $marks >= 7 && $marks < 8:
                    return 'A-';
                case $marks >= 6.5 && $marks < 7:
                    return 'B';
                case $marks >= 6 && $marks < 6.5:
                    return 'B+';
                case $marks >= 5.5 && $marks < 6:
                    return 'B-';
                case $marks >= 5 && $marks < 5.5:
                    return 'C+';
                case $marks >= 4.5 && $marks < 5:
                    return 'C';
                case $marks >= 4 && $marks < 4.5:
                    return 'D';
                case $marks >= 0 && $marks < 4:
                    return 'F';
                default:
                    return 'Invalid'; // Handle invalid marks input
            }

        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return $grade = 'A+';
                case $marks >= 75 && $marks < 80:
                    return $grade = 'A';
                case $marks >= 70 && $marks < 75:
                    return $grade = 'A-';
                case $marks >= 65 && $marks < 70:
                    return $grade = 'B';
                case $marks >= 60 && $marks < 65:
                    return $grade = 'B+';
                case $marks >= 55 && $marks < 60:
                    return $grade = 'B-';
                case $marks >= 50 && $marks < 55:
                    return $grade = 'C+';
                case $marks >= 45 && $marks < 50:
                    return $grade = 'C';
                case $marks >= 40 && $marks < 45:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 40:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return $grade = 'A+';
                case $marks >= 375 && $marks < 400:
                    return $grade = 'A';
                case $marks >= 350 && $marks < 375:
                    return $grade = 'A-';
                case $marks >= 325 && $marks < 350:
                    return $grade = 'B';
                case $marks >= 300 && $marks < 325:
                    return $grade = 'B+';
                case $marks >= 275 && $marks < 300:
                    return $grade = 'B-';
                case $marks >= 250 && $marks < 275:
                    return $grade = 'C+';
                case $marks >= 225 && $marks < 250:
                    return $grade = 'C';
                case $marks >= 200 && $marks < 225:
                    return $grade = 'D';
                case $marks >= 0 && $marks < 200:
                    return $grade = 'F';
                default:
                    return $grade = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';

        }

    }

    public function t_viva_gpa()
    {
        $marks = $this->result->viva;
        if ($this->course_type->is(CourseType::Regular())) {
            switch (true) {
                case $marks >= 8 && $marks <= 10:
                    return 4.00;
                case $marks >= 7.5 && $marks < 8:
                    return 3.75;
                case $marks >= 7 && $marks < 7.5:
                    return 3.50;
                case $marks >= 6.5 && $marks < 7:
                    return 3.25;
                case $marks >= 6 && $marks < 6.5:
                    return 3.00;
                case $marks >= 5.5 && $marks < 6:
                    return 2.75;
                case $marks >= 5 && $marks < 5.5:
                    return 2.50;
                case $marks >= 4.5 && $marks < 5:
                    return 2.25;
                case $marks >= 4 && $marks < 4.5:
                    return 2.00;
                case $marks >= 0 && $marks < 4:
                    return 0.00;
                default:
                    return 'Invalid'; // If marks are out of range
            }

        } elseif ($this->course_type->is(CourseType::Short_Course())) {
            switch (true) {
                case $marks >= 80 && $marks <= 100:
                    return $gpa = 4.00;
                case $marks >= 75 && $marks < 80:
                    return $gpa = 3.75;
                case $marks >= 70 && $marks < 75:
                    return $gpa = 3.50;
                case $marks >= 65 && $marks < 70:
                    return $gpa = 3.25;
                case $marks >= 60 && $marks < 65:
                    return $gpa = 3.00;
                case $marks >= 55 && $marks < 60:
                    return $gpa = 2.75;
                case $marks >= 50 && $marks < 55:
                    return $gpa = 2.50;
                case $marks >= 45 && $marks < 50:
                    return $gpa = 2.25;
                case $marks >= 40 && $marks < 45:
                    return $gpa = 2.00;
                case $marks >= 0 && $marks < 40:
                    return $gpa = 0.00;
                default:
                    return $gpa = 'Invalid'; // Handle invalid marks input
            }
        } elseif ($this->course_type->is(CourseType::Diploma())) {
            switch (true) {
                case $marks >= 400 && $marks <= 500:
                    return $gpa = 4.00;
                case $marks >= 375 && $marks < 400:
                    return $gpa = 3.75;
                case $marks >= 350 && $marks < 375:
                    return $gpa = 3.50;
                case $marks >= 325 && $marks < 350:
                    return $gpa = 3.25;
                case $marks >= 300 && $marks < 325:
                    return $gpa = 3.00;
                case $marks >= 275 && $marks < 300:
                    return $gpa = 2.75;
                case $marks >= 250 && $marks < 275:
                    return $gpa = 2.50;
                case $marks >= 225 && $marks < 250:
                    return $gpa = 2.25;
                case $marks >= 200 && $marks < 225:
                    return $gpa = 2.00;
                case $marks >= 0 && $marks < 200:
                    return $gpa = 0.00;
                default:
                    return $gpa = 'Invalid'; // Handle invalid marks input
            }
        } else {
            return 'N/A';
        }

    }
}
