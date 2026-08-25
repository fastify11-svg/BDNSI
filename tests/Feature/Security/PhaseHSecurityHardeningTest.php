<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class PhaseHSecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_env_is_production_safe()
    {
        Config::set('app.env', 'production');
        Config::set('app.debug', false);

        $this->artisan('system:production-health-check')
            ->assertExitCode(0);
    }

    public function test_database_integrity_command_exists()
    {
        $this->artisan('system:db-integrity-check')
            ->assertExitCode(0);
    }

    public function test_financial_reconciliation_command_exists()
    {
        $this->artisan('system:financial-reconciliation')
            ->assertExitCode(0);
    }

    public function test_health_check_command_exists()
    {
        $this->artisan('system:health-check')
            ->assertExitCode(0);
    }
}
