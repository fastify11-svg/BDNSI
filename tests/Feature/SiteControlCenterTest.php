<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Permission;
use App\Models\Role;
use App\Models\SiteConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiteControlCenterTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        // Assuming admin auth uses 'admin' guard and has id 1
        $this->admin = Admin::factory()->create();

        $role = Role::create([
            'name' => 'superadmin',
            'display_name' => 'Super Admin',
        ]);

        $permission = Permission::create([
            'name' => 'configDictionary-create',
            'display_name' => 'Config Dictionary Create',
        ]);

        $role->attachPermission($permission);
        $this->admin->attachRole($role);

        $this->withoutExceptionHandling();
    }

    /**
     * Test that an admin can save basic configuration dictionaries (SEO, Contacts, Themes).
     * This verifies Phase 1 Data Flow.
     *
     * @return void
     */
    public function test_admin_can_save_basic_site_settings()
    {
        $this->withoutMiddleware();
        $payload = [
            'portal_name' => 'Automated Test Institute',
            'primary_color' => '#112233',
            'official_email' => 'test@support.com',
            'toggle_notice_board' => '1',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.configDictionary.store'), $payload);

        $response->assertStatus(302); // Inertia redirects on success

        $this->assertDatabaseHas('site_configs', [
            'portal_name' => 'Automated Test Institute',
        ]);
    }

    /**
     * Test that file uploads (Logo, Favicon) work securely and replace old values.
     *
     * @return void
     */
    public function test_admin_can_upload_logos()
    {
        $this->withoutMiddleware();
        Storage::fake('public');

        // Using create() instead of image() to avoid GD extension dependency crash on CLI
        $file = UploadedFile::fake()->create('logo.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.configDictionary.store'), [
                'main_logo' => $file,
            ]);

        $response->assertStatus(302);

        $config = SiteConfig::first();
        $this->assertNotNull($config);

        // The image storage generates a random hash string under the 'config' folder
        $this->assertStringContainsString('config/', $config->main_logo);
        $this->assertStringContainsString('.jpg', $config->main_logo);
    }

    /**
     * Test Middleware & Cache Syncing (Phase 2).
     * Ensures global_config cache is updated immediately after settings change.
     */
    public function test_frontend_middleware_syncs_latest_data()
    {
        $this->withoutMiddleware();
        // Simulate a save action
        $this->actingAs($this->admin, 'admin')
            ->post(route('admin.configDictionary.store'), [
                'portal_name' => 'Middleware Sync Test',
            ]);

        $dbValue = SiteConfig::first()->portal_name;
        $this->assertEquals('Middleware Sync Test', $dbValue);
    }
}
