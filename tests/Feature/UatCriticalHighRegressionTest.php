<?php

namespace Tests\Feature;

use App\Enums\CenterStatus;
use App\Http\Controllers\Admin\CenterController;
use App\Models\Center;
use App\Models\District;
use App\Models\Division;
use App\Models\Price;
use App\Models\Session;
use App\Models\Upazila;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class UatCriticalHighRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_fresh_database_contains_required_geographic_reference_data(): void
    {
        $this->assertSame(8, Division::count());
        $this->assertSame(64, District::count());
        $this->assertGreaterThan(400, Upazila::count());

        $dhaka = District::where('name', 'Dhaka')->firstOrFail();
        $this->assertTrue(Upazila::where('district_id', $dhaka->id)->exists());
    }

    public function test_session_dates_survive_create_and_serialization_round_trip(): void
    {
        $session = Session::create([
            'name' => 'DEMO-UAT-R2 Jan-Jun 2026',
            'duration' => 6,
            'exam_date' => '2026-06-25',
            'result_published_date' => '2026-07-10',
            'status' => 1,
        ])->fresh();

        $this->assertSame('2026-06-25', $session->exam_date?->format('Y-m-d'));
        $this->assertSame('2026-07-10', $session->result_published_date?->format('Y-m-d'));
        $this->assertSame('2026-06-25', $session->toArray()['exam_date']);
        $this->assertSame('2026-07-10', $session->toArray()['result_published_date']);
    }

    public function test_price_effective_date_survives_create_and_serialization_round_trip(): void
    {
        $price = Price::create([
            'product_type' => 'Registration',
            'base_price' => 1000,
            'discount' => 100,
            'effective_from' => '2026-09-14',
            'status' => true,
        ])->fresh();

        $this->assertSame('2026-09-14', $price->effective_from?->format('Y-m-d'));
        $this->assertSame('2026-09-14', $price->toArray()['effective_from']);
    }

    public function test_converted_center_without_email_can_be_approved_and_get_portal_user(): void
    {
        $center = Center::factory()->create([
            'email' => null,
            'status' => CenterStatus::Pending,
        ]);

        $request = Request::create(
            '/admin/center/'.$center->id.'/status',
            'PATCH',
            ['status' => CenterStatus::Approved->value]
        );

        app(CenterController::class)->updateStatus($request, $center);

        $center->refresh();
        $this->assertSame(CenterStatus::Approved, $center->status);

        $portalUser = User::where('center_id', $center->id)->first();
        $this->assertNotNull($portalUser);
        $this->assertNotEmpty($portalUser->email);
        $this->assertStringContainsString('@', $portalUser->email);
    }
}
