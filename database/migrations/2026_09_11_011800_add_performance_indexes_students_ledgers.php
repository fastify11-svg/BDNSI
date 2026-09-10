<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Add performance indexes for students.
 *
 * students:
 *   - (session_id, subject_id, center_id): Used in CenterTotalResultController for result query filtering.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (!$this->indexExists('students', 'idx_student_session_subject_center')) {
                $table->index(['session_id', 'subject_id', 'center_id'], 'idx_student_session_subject_center');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if ($this->indexExists('students', 'idx_student_session_subject_center')) {
                $table->dropIndex('idx_student_session_subject_center');
            }
        });
    }

    private function indexExists(string $table, string $indexName): bool
    {
        return collect(DB::select(
            "SELECT INDEX_NAME FROM information_schema.STATISTICS 
             WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = ? 
               AND INDEX_NAME = ?",
            [$table, $indexName]
        ))->isNotEmpty();
    }
};
