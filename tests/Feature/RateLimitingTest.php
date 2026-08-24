<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Illuminate\Support\Facades\Cache::flush();
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
    }

    public function test_results_route_is_rate_limited()
    {
        $this->seed();
        // Send 10 allowed requests
        for ($i = 0; $i < 10; $i++) {
            $response = $this->get('/result?roll=123456');
            $this->assertNotEquals(429, $response->status());
        }
        // The 11th request should be rate limited
        $response = $this->get('/result?roll=123456');
        $response->assertStatus(429);
    }

    public function test_contact_route_is_rate_limited()
    {
        $this->seed();
        // Send 3 allowed requests
        for ($i = 0; $i < 3; $i++) {
            $response = $this->post('/contact-us', [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'subject' => 'Test Subject',
                'message' => 'Test Message Content',
            ]);
            $this->assertNotEquals(429, $response->status());
        }
        // The 4th request should be rate limited
        $response = $this->post('/contact-us', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'subject' => 'Test Subject',
            'message' => 'Test Message Content',
        ]);
        $response->assertStatus(429);
    }

    public function test_admin_login_route_is_rate_limited()
    {
        $this->seed();
        // Send 5 allowed requests
        for ($i = 0; $i < 5; $i++) {
            $response = $this->post('/admin/login', [
                'email' => 'admin@admin.com',
                'password' => 'wrongpassword',
            ]);
            $this->assertNotEquals(429, $response->status());
        }
        // The 6th request should be rate limited
        $response = $this->post('/admin/login', [
            'email' => 'admin@admin.com',
            'password' => 'wrongpassword',
        ]);
        $response->assertStatus(429);
    }
}
