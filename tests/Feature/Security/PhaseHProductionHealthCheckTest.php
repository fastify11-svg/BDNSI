<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class PhaseHProductionHealthCheckTest extends TestCase
{
    public function test_it_fails_if_app_debug_is_true()
    {
        Config::set('app.env', 'production');
        Config::set('app.debug', true);

        $this->artisan('system:production-health-check')
            ->expectsOutput('APP_DEBUG is TRUE! This is a critical security risk in production.')
            ->assertExitCode(1);
    }

    public function test_it_fails_if_app_env_is_not_production()
    {
        Config::set('app.env', 'local');
        Config::set('app.debug', false);

        $this->artisan('system:production-health-check')
            ->expectsOutput('APP_ENV is not set to production (Currently: local).')
            ->assertExitCode(1);
    }

    public function test_it_passes_if_environment_is_safe()
    {
        Config::set('app.env', 'production');
        Config::set('app.debug', false);
        Config::set('app.key', 'base64:randomkeyhere');
        Config::set('queue.default', 'redis');

        $this->artisan('system:production-health-check')
            ->expectsOutput('Production health check PASSED. All critical configurations are safe.')
            ->assertExitCode(0);
    }
}
