<?php

namespace Tests\Feature;

use App\Enums\StudentStatus;
use App\Models\Center;
use App\Models\Order;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhaseDCenterDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_center_dashboard_loads_with_correct_data()
    {
        $center = Center::factory()->create();
        $user = User::factory()->create(['center_id' => $center->id, 'username' => 'center'.time(), 'phone' => '1234567890']);
        $session = \App\Models\Session::create(['name' => 'Test Session', 'status' => \App\Enums\SessionStatus::Active, 'course_type' => \App\Enums\CourseType::Regular, 'duration' => 6]);
        $subject = \App\Models\Subject::create(['name' => 'Test Subject', 'code' => 'TS101', 'fee' => 1000]);

        $order = Order::create([
            'center_id' => $center->id,
            'order_number' => 'ORD-' . time(),
            'total_amount' => 1000,
            'status' => 'Pending',
            'payment_status' => 'Unpaid'
        ]);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => StudentStatus::Approved,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertStatus(200);
        
        // Assert view receives the correct props via Inertia
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Center/Dashboard')
            ->has('cards')
            ->has('financials')
            ->has('recent_orders', 1)
            ->has('recent_students', 1)
            ->where('recent_orders.0.id', $order->id)
            ->where('recent_students.0.id', $student->id)
        );
    }

    public function test_center_dashboard_tenant_isolation()
    {
        $center1 = Center::factory()->create();
        $user1 = User::factory()->create(['center_id' => $center1->id, 'username' => 'center1'.time(), 'phone' => '01700000001']);

        $center2 = Center::factory()->create();
        $user2 = User::factory()->create(['center_id' => $center2->id, 'username' => 'center2'.time(), 'phone' => '01700000002']);
        $session = \App\Models\Session::create(['name' => 'Test Session 2', 'status' => \App\Enums\SessionStatus::Active, 'course_type' => \App\Enums\CourseType::Regular, 'duration' => 6]);
        $subject = \App\Models\Subject::create(['name' => 'Test Subject 2', 'code' => 'TS102', 'fee' => 1000]);

        $order2 = Order::create([
            'center_id' => $center2->id,
            'order_number' => 'ORD-C2',
            'total_amount' => 1000,
            'status' => 'Pending',
            'payment_status' => 'Unpaid'
        ]);

        $student2 = Student::factory()->create([
            'center_id' => $center2->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => StudentStatus::Approved,
        ]);

        // User 1 logs in
        $response = $this->actingAs($user1)->get(route('dashboard'));

        $response->assertStatus(200);
        
        // User 1 should not see User 2's orders or students
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Center/Dashboard')
            ->has('recent_orders', 0)
            ->has('recent_students', 0)
        );
    }
}
