<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MakeSessionDatesNullableOnLive extends Migration
{
    /**
     * Run the migrations.
     *
     * This is a compatibility migration for live databases that may still
     * contain the legacy start_date/end_date columns. Fresh installations
     * where those columns were already removed must remain a no-op.
     */
    public function up(): void
    {
        if (Schema::hasColumn('sessions', 'start_date')) {
            DB::statement('ALTER TABLE sessions MODIFY start_date DATE NULL');
        }

        if (Schema::hasColumn('sessions', 'end_date')) {
            DB::statement('ALTER TABLE sessions MODIFY end_date DATE NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Forward-only compatibility fix: previous nullability cannot be
        // determined safely across heterogeneous existing environments.
    }
}
