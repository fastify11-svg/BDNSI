<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCascadeForeignKeysToLegacyTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['center_id']);
            $table->foreign('center_id')->references('id')->on('centers')->onDelete('cascade');
        });

        Schema::table('results', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['center_id']);
            $table->foreign('center_id')->references('id')->on('centers');
        });

        Schema::table('results', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->foreign('student_id')->references('id')->on('students');
        });
    }
}
