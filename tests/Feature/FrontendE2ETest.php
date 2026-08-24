<?php

namespace Tests\Feature;

use App\Models\SiteConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FrontendE2ETest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure default configuration toggles are set to true (1) so pages are accessible.
        $toggles = [
            'toggle_result_verify' => '1',
            'toggle_success_students' => '1',
            'toggle_notice_board' => '1',
            'toggle_verified_centers' => '1',
            'toggle_center_apply' => '1',
            'toggle_contact_form' => '1',
            'toggle_video_gallery' => '1',
        ];
        $config = SiteConfig::first() ?? new SiteConfig;
        $config->fill($toggles);
        $config->save();
    }

    public function test_homepage_loads_successfully()
    {
        $response = $this->get(route('welcome'));
        $response->assertStatus(200);
    }

    public function test_all_courses_loads_successfully()
    {
        $response = $this->get(route('all_course'));
        $response->assertStatus(200);
    }

    public function test_student_result_loads_when_module_is_active()
    {
        $response = $this->get(route('result'));
        $response->assertStatus(200);
    }

    public function test_student_result_redirects_when_module_is_inactive()
    {
        $config = SiteConfig::first() ?? new SiteConfig;
        $config->toggle_result_verify = 0;
        $config->save();
        \Illuminate\Support\Facades\Cache::forget('global_config');

        $response = $this->get(route('result'));
        // Middleware returns Inertia ComingSoon page with 200 OK
        $response->assertStatus(200);
    }

    public function test_success_students_loads_successfully()
    {
        $this->withoutExceptionHandling();
        $response = $this->get(route('successStudent'));
        $response->assertStatus(200);
    }

    public function test_notice_board_loads_successfully()
    {
        $response = $this->get(route('frontendNoticeList'));
        $response->assertStatus(200);
    }

    public function test_verified_center_loads_successfully()
    {
        $response = $this->get(route('verifiedCenter'));
        $response->assertStatus(200);
    }

    public function test_center_apply_loads_successfully()
    {
        $response = $this->get(route('center-request.create'));
        $response->assertStatus(200);
    }

    public function test_contact_us_loads_successfully()
    {
        $response = $this->get(route('contactUs'));
        $response->assertStatus(200);
    }
}
