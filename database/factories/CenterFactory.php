<?php

namespace Database\Factories;

use App\Models\Center;
use Illuminate\Database\Eloquent\Factories\Factory;

class CenterFactory extends Factory
{
    protected $model = Center::class;

    public function definition()
    {
        return [
            'code' => (string) $this->faker->unique()->randomNumber(6),
            'name' => $this->faker->company,
            'owner_name' => $this->faker->name,
            'fathers_name' => $this->faker->name,
            'mothers_name' => $this->faker->name,
            'religion' => 1,
            'gender' => 1,
            'division' => 1,
            'district' => 1,
            'upazilla' => 1,
            'address' => $this->faker->address,
            'mobile' => '01711111111',
            'status' => 1, // Approved
            'credit_enabled' => false,
            'credit_limit' => 0,
            'current_due' => 0,
            'allow_registration_without_payment' => false,
            'allow_result_without_payment' => false,
            'allow_certificate_without_payment' => false,
        ];
    }
}
