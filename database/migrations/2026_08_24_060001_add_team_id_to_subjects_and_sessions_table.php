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
        Schema::table('subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('subjects', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('id')->index();
            }
        });

        Schema::table('sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('sessions', 'team_id')) {
                $table->unsignedBigInteger('team_id')->nullable()->after('id')->index();
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
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn('team_id');
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->dropColumn('team_id');
        });
    }
};
