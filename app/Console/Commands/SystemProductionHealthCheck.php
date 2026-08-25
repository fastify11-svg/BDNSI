<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SystemProductionHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:production-health-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifies that production environment variables and critical configurations are safe and present.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Production Health Check...');
        $hasError = false;

        // 1. Check APP_ENV
        if (config('app.env') !== 'production') {
            $this->error('APP_ENV is not set to production (Currently: ' . config('app.env') . ').');
            $hasError = true;
        } else {
            $this->info('✓ APP_ENV is production');
        }

        // 2. Check APP_DEBUG
        if (config('app.debug') === true) {
            $this->error('APP_DEBUG is TRUE! This is a critical security risk in production.');
            $hasError = true;
        } else {
            $this->info('✓ APP_DEBUG is false');
        }

        // 3. Check APP_KEY
        if (empty(config('app.key'))) {
            $this->error('APP_KEY is missing!');
            $hasError = true;
        } else {
            $this->info('✓ APP_KEY is present');
        }

        // 4. Check Database Connection
        try {
            DB::connection()->getPdo();
            $this->info('✓ Database connection successful');
        } catch (\Exception $e) {
            $this->error('Database connection failed: ' . $e->getMessage());
            $hasError = true;
        }

        // 5. Check SSLCommerz Secrets (Environment driven)
        $sslRequired = [
            'SSLCOMMERZ_STORE_ID' => config('sslcommerz.store_id'),
            'SSLCOMMERZ_STORE_PASSWORD' => config('sslcommerz.store_password')
        ];

        foreach ($sslRequired as $key => $val) {
            if (empty($val)) {
                $this->warn("Payment gateway credential missing: $key");
            } else {
                $this->info("✓ Payment gateway credential present: $key");
            }
        }

        // 6. Check Queue Connection
        if (config('queue.default') === 'sync' && config('app.env') === 'production') {
            $this->warn('Queue driver is set to "sync" in production. Background jobs will block requests.');
        } else {
            $this->info('✓ Queue driver: ' . config('queue.default'));
        }

        // 7. Check Private/Public storage access
        if (!Storage::disk('private')->exists('.gitignore')) {
            // It's okay if gitignore is missing, just checking disk access
            try {
                Storage::disk('private')->put('health_test.txt', 'ok');
                Storage::disk('private')->delete('health_test.txt');
                $this->info('✓ Private storage is writable');
            } catch (\Exception $e) {
                $this->error('Private storage not writable: ' . $e->getMessage());
                $hasError = true;
            }
        } else {
            $this->info('✓ Private storage is accessible');
        }

        if ($hasError) {
            $this->error('Production health check FAILED. The system is unsafe for production deployment.');
            return 1;
        }

        $this->info('Production health check PASSED. All critical configurations are safe.');
        return 0;
    }
}
