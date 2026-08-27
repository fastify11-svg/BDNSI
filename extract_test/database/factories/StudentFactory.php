<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StudentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Student::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => \Illuminate\Support\Str::random(10),
            'fathers_name' => 'Test Father',
            'mothers_name' => 'Test Mother',
            'date_of_birth' => '2000-01-01',
            'gender' => 0,
            'religion' => 0,
            'blood_group' => 0,
            'present_address' => 'Present Address',
            'permanent_address' => 'Permanent Address',
            'phone' => '01700000000',
        ];
    }
}
