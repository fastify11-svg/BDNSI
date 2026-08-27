<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            try {
                DB::statement('ALTER TABLE `centers` MODIFY `code` VARCHAR(191) NULL');
            } catch (Throwable $e) {
            }
            try {
                DB::statement('ALTER TABLE `centers` MODIFY `division` INT NULL');
            } catch (Throwable $e) {
            }
            try {
                DB::statement('ALTER TABLE `centers` MODIFY `district` INT NULL');
            } catch (Throwable $e) {
            }
            try {
                DB::statement('ALTER TABLE `centers` MODIFY `upazilla` INT NULL');
            } catch (Throwable $e) {
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
