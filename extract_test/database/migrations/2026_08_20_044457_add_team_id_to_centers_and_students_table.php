<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('centers', function (Blueprint $table) {
            if (!Schema::hasColumn('centers', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('id');
            }
        });

        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('center_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('centers_and_students', function (Blueprint $table) {
            //
        });
    }
};
