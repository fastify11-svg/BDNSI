<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLangToNoticesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->longText('bn_details')->nullable();
            $table->longText('ar_details')->nullable();
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->string('bn_name')->nullable();
            $table->string('ar_name')->nullable();

            $table->string('bn_designation')->nullable();
            $table->string('ar_designation')->nullable();

            $table->longText('bn_description')->nullable();
            $table->longText('ar_description')->nullable();

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->dropColumn([
                'bn_details',
                'ar_details',
            ]);
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn([
                'bn_name',
                'ar_name',

                'bn_designation',
                'ar_designation',

                'bn_description',
                'ar_description',
            ]);
        });

    }
}
