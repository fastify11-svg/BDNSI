<?php

namespace Database\Seeders;

use App\Models\GradeScale;
use Illuminate\Database\Seeder;

class GradeScaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $scales = [
            [
                'course_type' => 0, // Regular
                'max_marks'   => 100,
                'rules'       => [
                    ['min_percent' => 80, 'max_percent' => 100, 'grade_name' => 'A+'],
                    ['min_percent' => 70, 'max_percent' => 79.99, 'grade_name' => 'A'],
                    ['min_percent' => 60, 'max_percent' => 69.99, 'grade_name' => 'A-'],
                    ['min_percent' => 50, 'max_percent' => 59.99, 'grade_name' => 'B'],
                    ['min_percent' => 40, 'max_percent' => 49.99, 'grade_name' => 'C'],
                    ['min_percent' => 0,  'max_percent' => 39.99, 'grade_name' => 'F'],
                ],
            ],
            [
                'course_type' => 1, // Short
                'max_marks'   => 1200,
                'rules'       => [
                    ['min_percent' => 80, 'max_percent' => 100, 'grade_name' => 'A+'],
                    ['min_percent' => 70, 'max_percent' => 79.99, 'grade_name' => 'A'],
                    ['min_percent' => 60, 'max_percent' => 69.99, 'grade_name' => 'A-'],
                    ['min_percent' => 50, 'max_percent' => 59.99, 'grade_name' => 'B'],
                    ['min_percent' => 40, 'max_percent' => 49.99, 'grade_name' => 'C'],
                    ['min_percent' => 0,  'max_percent' => 39.99, 'grade_name' => 'F'],
                ],
            ],
            [
                'course_type' => 2, // Diploma
                'max_marks'   => 4800,
                'rules'       => [
                    ['min_percent' => 80, 'max_percent' => 100, 'grade_name' => 'A+'],
                    ['min_percent' => 70, 'max_percent' => 79.99, 'grade_name' => 'A'],
                    ['min_percent' => 60, 'max_percent' => 69.99, 'grade_name' => 'A-'],
                    ['min_percent' => 50, 'max_percent' => 59.99, 'grade_name' => 'B'],
                    ['min_percent' => 40, 'max_percent' => 49.99, 'grade_name' => 'C'],
                    ['min_percent' => 0,  'max_percent' => 39.99, 'grade_name' => 'F'],
                ],
            ],
        ];

        foreach ($scales as $scale) {
            GradeScale::updateOrCreate(
                ['course_type' => $scale['course_type']],
                [
                    'max_marks' => $scale['max_marks'],
                    'rules'     => $scale['rules'],
                ]
            );
        }

        $this->command->info('✅ GradeScale data seeded successfully.');
    }
}
