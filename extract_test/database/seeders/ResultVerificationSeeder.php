<?php

namespace Database\Seeders;

use App\Enums\BloodGroup;
use App\Enums\CourseType;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Enums\StudentStatus;
use App\Models\Center;
use App\Models\Result;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class ResultVerificationSeeder extends Seeder
{
    public function run()
    {
        $center = Center::first() ?? Center::factory()->create();
        $session = Session::first() ?? Session::create(['name' => '2025-2026']);
        $subject = Subject::first() ?? Subject::create(['name' => 'Computer Technology', 'code' => 'CT', 'duration' => 6]);

        $studentsData = [
            ['name' => 'Demo Student 1', 'registration' => 'REG2025001', 'roll' => '250001', 'passport' => 'PASS1'],
            ['name' => 'Demo Student 2', 'registration' => 'REG2025002', 'roll' => '250002', 'passport' => 'PASS2'],
            ['name' => 'Demo Student 3', 'registration' => 'REG2025003', 'roll' => '250003', 'passport' => 'PASS3'],
        ];

        foreach ($studentsData as $data) {
            $student = Student::updateOrCreate(
                ['registration' => $data['registration']],
                [
                    'center_id' => $center->id,
                    'name' => $data['name'],
                    'fathers_name' => 'John Doe',
                    'mothers_name' => 'Jane Doe',
                    'roll' => $data['roll'],
                    'passport' => $data['passport'],
                    'date_of_birth' => '2000-01-01',
                    'session_id' => $session->id,
                    'subject_id' => $subject->id,
                    'status' => StudentStatus::Approved(),
                    'course_type' => CourseType::Regular(),
                    'gender' => Gender::Male(),
                    'religion' => Religion::Muslim(),
                    'blood_group' => BloodGroup::A_Positive(),
                    'phone' => '01700000000',
                    'present_address' => 'Dhaka',
                    'permanent_address' => 'Dhaka',
                ]
            );

            Result::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'written' => rand(70, 90),
                    'practical' => rand(70, 90),
                    'viva' => rand(70, 90),
                    'certificate' => 'certificates/dummy_certificate.pdf',
                ]
            );
        }
    }
}
