<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Non-destructive migration: allowed_vehicles → credential_type
     * Uses raw MySQL ALTER TABLE to avoid requiring doctrine/dbal.
     */
    public function up(): void
    {
        if (Schema::hasColumn('licenses', 'allowed_vehicles')) {
            // Rename column using raw SQL (no doctrine/dbal needed)
            DB::statement("ALTER TABLE `licenses` CHANGE `allowed_vehicles` `credential_type` TEXT NULL DEFAULT NULL");

            // Overwrite old driving-school JSON values with the correct vocational label
            DB::statement("UPDATE `licenses` SET `credential_type` = 'Vocational Certificate' WHERE `credential_type` IS NULL OR `credential_type` IN ('[]', 'null', '')");
        } elseif (!Schema::hasColumn('licenses', 'credential_type')) {
            // Fresh install path — add the column directly
            DB::statement("ALTER TABLE `licenses` ADD COLUMN `credential_type` VARCHAR(255) NULL DEFAULT 'Vocational Certificate'");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('licenses', 'credential_type')) {
            DB::statement("ALTER TABLE `licenses` CHANGE `credential_type` `allowed_vehicles` TEXT NULL DEFAULT NULL");
        }
    }
};
