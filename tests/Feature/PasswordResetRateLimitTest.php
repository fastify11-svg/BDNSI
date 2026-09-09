<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PasswordResetRateLimitTest extends TestCase
{
    /**
     * Test that password reset requests are rate limited.
     *
     * @return void
     */
    public function test_password_reset_is_rate_limited()
    {
        // Define the payload for a password reset request
        $payload = [
            'email' => 'test@example.com',
        ];

        // Send 3 requests (the allowed limit per minute)
        for ($i = 0; $i < 3; $i++) {
            $response = $this->post('/forgot-password', $payload);
            // It might return 302 (redirect back with errors) or 200/302 (success)
            // But it should NOT be 429
            $this->assertNotEquals(429, $response->status());
        }

        // The 4th request should be rate limited and return 429 Too Many Requests
        $response = $this->post('/forgot-password', $payload);
        $response->assertStatus(429);
    }
}
