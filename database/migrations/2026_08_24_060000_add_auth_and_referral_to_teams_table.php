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
        Schema::table('teams', function (Blueprint $table) {
            if (!Schema::hasColumn('teams', 'password')) {
                $table->string('password')->nullable()->after('email');
            }
            if (!Schema::hasColumn('teams', 'referral_code')) {
                $table->string('referral_code')->nullable()->unique()->after('phone');
            }
            if (!Schema::hasColumn('teams', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('status');
            }
            if (!Schema::hasColumn('teams', 'remember_token')) {
                $table->rememberToken()->after('password');
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
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn([
                'password',
                'referral_code',
                'is_active',
                'remember_token',
            ]);
        });
    }
};
