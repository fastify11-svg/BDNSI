<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Add performance indexes to audit_logs table.
 *
 * The audit_logs table is queried by:
 *   - event type (filtering by specific events like 'AUTO_SUSPEND', 'OVERRIDE')
 *   - user_id (finding all actions by an admin)
 *   - created_at (date-range queries in the audit trail viewer)
 *
 * These indexes make those queries O(log N) instead of O(N).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            if (!$this->indexExists('audit_logs', 'audit_logs_event_index')) {
                $table->index('event');
            }
            if (!$this->indexExists('audit_logs', 'audit_logs_user_id_index')) {
                $table->index('user_id');
            }
            if (!$this->indexExists('audit_logs', 'audit_logs_created_at_index')) {
                $table->index('created_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['event']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['created_at']);
        });
    }

    /**
     * Check if an index already exists to make migration idempotent.
     */
    private function indexExists(string $table, string $indexName): bool
    {
        $connection = DB::connection();

        if ($connection->getDriverName() === 'sqlite') {
            return collect($connection->select("PRAGMA index_list('{$table}')"))
                ->contains(function ($index) use ($indexName) {
                    return ($index->name ?? null) === $indexName;
                });
        }

        return collect($connection->select(
            "SELECT INDEX_NAME FROM information_schema.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = ?
               AND INDEX_NAME = ?",
            [$table, $indexName]
        ))->isNotEmpty();
    }
};
