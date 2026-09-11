<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeSessionDatesNullableOnLive extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE sessions MODIFY start_date DATE NULL, MODIFY end_date DATE NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We cannot reliably determine the previous state (NOT NULL vs NULL), 
        // and we want this to be a forward-only fix.
    }
}
