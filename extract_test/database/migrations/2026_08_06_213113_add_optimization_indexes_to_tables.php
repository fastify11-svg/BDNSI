<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOptimizationIndexesToTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->index('status');
            $table->index('roll');
            $table->index('registration');
            $table->index('created_at');
        });

        Schema::table('centers', function (Blueprint $table) {
            $table->index('status');
            $table->index('name');
            $table->index('created_at');
            // 'code' already has unique index
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->index('name');
            $table->index('code');
        });

        Schema::table('contact_us', function (Blueprint $table) {
            $table->index('is_seen');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['roll']);
            $table->dropIndex(['registration']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('centers', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['name']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['code']);
        });

        Schema::table('contact_us', function (Blueprint $table) {
            $table->dropIndex(['is_seen']);
            $table->dropIndex(['created_at']);
        });
    }
}
