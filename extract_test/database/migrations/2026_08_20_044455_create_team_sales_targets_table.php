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
        if (!Schema::hasTable('team_sales_targets')) {
            Schema::create('team_sales_targets', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('team_id');
                $table->date('target_date');
                $table->integer('student_target')->default(0);
                $table->integer('b2b_certificate_target')->default(0);
                $table->timestamps();

                // Unique constraint so a team member can only have one target per day
                $table->unique(['team_id', 'target_date']);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('team_sales_targets');
    }
};
