<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PasswordResetRateLimitTest extends TestCase
{
    use RefreshDatabase;

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
    public function test_expired_password_reset_token_is_rejected()
    {
        $center = \App\Models\Center::factory()->create(['id' => 1, 'code' => 'C-001']);
        $user = \App\Models\User::factory()->create(['center_id' => $center->id, 'username' => 'testuser', 'phone' => '01700000000']);
        
        $token = \Illuminate\Support\Facades\Password::broker()->createToken($user);

        // Backdate the token in the database by 61 minutes
        \Illuminate\Support\Facades\DB::table('password_resets')
            ->where('email', $user->email)
            ->update(['created_at' => now()->subMinutes(61)]);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // It should reject with invalid token or redirect with error
        $response->assertSessionHasErrors(['email']);
    }
}
