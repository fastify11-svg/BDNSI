<?php

namespace Tests\Feature;

use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class StaffPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_page_can_be_rendered()
    {
        $response = $this->get(route('staff.password.request'));

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested()
    {
        $staff = Team::create([
            'name' => 'Staff',
            'email' => 'staff@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post(route('staff.password.email'), [
            'email' => $staff->email,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        $this->assertDatabaseHas('password_resets', [
            'email' => $staff->email,
        ]);
    }

    public function test_reset_password_page_can_be_rendered()
    {
        $response = $this->get(route('staff.password.reset', ['token' => 'dummy-token']));

        $response->assertStatus(200);
    }
}
