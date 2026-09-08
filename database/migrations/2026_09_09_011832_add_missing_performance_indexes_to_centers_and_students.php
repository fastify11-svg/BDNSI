<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingPerformanceIndexesToCentersAndStudents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('centers', function (Blueprint $table) {
            $table->index('team_id');
        });
        
        Schema::table('students', function (Blueprint $table) {
            $table->index('team_id');
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
            $table->dropIndex(['team_id']);
        });
        
        Schema::table('centers', function (Blueprint $table) {
            $table->dropIndex(['team_id']);
        });
    }
}
