<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhaseDOrderAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_center_can_view_own_orders()
    {
        $center = Center::factory()->create();
        $user = User::factory()->create(['center_id' => $center->id, 'username' => 'center'.time(), 'phone' => '1234567890']);

        $order = Order::create([
            'center_id' => $center->id,
            'order_number' => 'ORD-123',
            'total_amount' => 500,
            'status' => \App\Models\Order::STATUS_PENDING,
            'payment_status' => 'Unpaid'
        ]);

        $response = $this->actingAs($user)->get(route('center.orders.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Center/Order/Index')
            ->has('orders.data', 1)
        );
    }

    public function test_center_cannot_view_other_centers_orders()
    {
        $center1 = Center::factory()->create();
        $user1 = User::factory()->create(['center_id' => $center1->id, 'username' => 'center1'.time(), 'phone' => '1234567890']);

        $center2 = Center::factory()->create();
        $order2 = Order::create([
            'center_id' => $center2->id,
            'order_number' => 'ORD-456',
            'total_amount' => 500,
            'status' => \App\Models\Order::STATUS_PENDING,
            'payment_status' => 'Unpaid'
        ]);

        $response = $this->actingAs($user1)->get(route('center.orders.show', $order2->id));
        
        $response->assertStatus(404);
    }
}
