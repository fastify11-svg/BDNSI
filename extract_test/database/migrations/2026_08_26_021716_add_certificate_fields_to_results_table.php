<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCertificateFieldsToResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->string('certificate_serial')->nullable()->unique()->after('certificate');
            $table->string('qr_code_path')->nullable()->after('certificate_serial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->dropColumn(['certificate_serial', 'qr_code_path']);
        });
    }
}
