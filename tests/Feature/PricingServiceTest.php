<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Price;
use App\Services\PricingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricingServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_resolves_default_system_price()
    {
        Price::create([
            'center_id' => null,
            'product_type' => 'student_registration',
            'base_price' => 1000,
            'discount' => 100,
            'status' => true,
        ]);

        $service = new PricingService();
        $price = $service->resolvePrice('student_registration');

        $this->assertEquals(1000, $price['base_price']);
        $this->assertEquals(100, $price['discount']);
        $this->assertEquals(900, $price['final_price']);
    }

    public function test_it_resolves_center_specific_price_over_default()
    {
        // Default price
        Price::create([
            'center_id' => null,
            'product_type' => 'student_registration',
            'base_price' => 1000,
            'status' => true,
        ]);

        $center = Center::factory()->create();

        // Center-specific price
        Price::create([
            'center_id' => $center->id,
            'product_type' => 'student_registration',
            'base_price' => 800,
            'discount' => 50,
            'status' => true,
        ]);

        $service = new PricingService();
        $price = $service->resolvePrice('student_registration', $center->id);

        $this->assertEquals(800, $price['base_price']);
        $this->assertEquals(50, $price['discount']);
        $this->assertEquals(750, $price['final_price']);
    }
}
