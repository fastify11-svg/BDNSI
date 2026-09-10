<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingPerformanceIndexesToTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_documents', function (Blueprint $table) {
            $table->index('status', 'student_documents_status_index');
        });

        Schema::table('center_ledgers', function (Blueprint $table) {
            $table->index('created_at', 'center_ledgers_created_at_index');
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->index('status', 'commissions_status_index');
        });

        Schema::table('results', function (Blueprint $table) {
            $table->index('created_at', 'results_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('results', function (Blueprint $table) {
            $table->dropIndex('results_created_at_index');
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->dropIndex('commissions_status_index');
        });

        Schema::table('center_ledgers', function (Blueprint $table) {
            $table->dropIndex('center_ledgers_created_at_index');
        });

        Schema::table('student_documents', function (Blueprint $table) {
            $table->dropIndex('student_documents_status_index');
        });
    }
}
