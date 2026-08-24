<?php

namespace Tests\Feature;

use App\Models\SiteConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModuleToggleTest extends TestCase
{
    use RefreshDatabase;

    public function test_result_verify_route_is_disabled_when_toggle_is_off()
    {
        $this->seed();

        // Turn toggle OFF
        $config = SiteConfig::first();
        $config->update(['toggle_result_verify' => 0]);
        // Note: the model might have booted method to clear cache, but let's clear it explicitly to be safe
        \Illuminate\Support\Facades\Cache::forget('global_config');

        $response = $this->get('/result');
        $response->assertStatus(200);
    }

    public function test_result_verify_route_is_accessible_when_toggle_is_on()
    {
        $this->seed();

        // Turn toggle ON
        $config = SiteConfig::first();
        $config->update(['toggle_result_verify' => 1]);
        \Illuminate\Support\Facades\Cache::forget('global_config');

        $response = $this->get('/result');
        $response->assertStatus(200);
    }

    public function test_success_students_route_is_disabled_when_toggle_is_off()
    {
        $this->seed();

        $config = SiteConfig::first();
        $config->update(['toggle_success_students' => 0]);
        \Illuminate\Support\Facades\Cache::forget('global_config');

        $response = $this->get('/success-student');
        $response->assertStatus(200);
    }
}
