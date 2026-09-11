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
        Schema::table('sessions', function (Blueprint $table) {
            if (Schema::hasColumn('sessions', 'start_date')) {
                $table->date('start_date')->nullable()->change();
            }
            if (Schema::hasColumn('sessions', 'end_date')) {
                $table->date('end_date')->nullable()->change();
            }
        });
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
