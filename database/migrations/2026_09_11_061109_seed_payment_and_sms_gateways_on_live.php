<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SeedPaymentAndSmsGatewaysOnLive extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'PaymentGatewaySeeder',
            '--force' => true,
        ]);
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'SmsGatewaySeeder',
            '--force' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
}
