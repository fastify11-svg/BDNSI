<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFinancialFieldsToCentersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            $table->boolean('credit_enabled')->default(false);
            $table->decimal('credit_limit', 10, 2)->default(0);
            $table->decimal('current_due', 10, 2)->default(0);
            $table->boolean('allow_registration_without_payment')->default(false);
            $table->boolean('allow_result_without_payment')->default(false);
            $table->boolean('allow_certificate_without_payment')->default(false);
            $table->boolean('auto_restriction')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            $table->dropColumn([
                'credit_enabled',
                'credit_limit',
                'current_due',
                'allow_registration_without_payment',
                'allow_result_without_payment',
                'allow_certificate_without_payment',
                'auto_restriction'
            ]);
        });
    }
}
