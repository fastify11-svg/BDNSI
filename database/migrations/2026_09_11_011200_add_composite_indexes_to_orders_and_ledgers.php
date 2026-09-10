<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Add composite indexes for high-frequency queries on orders and center_ledgers.
 *
 * orders:
 *   - (center_id, status) — used in CenterRisk batch query and commission dashboard filter
 *   - (center_id, due_amount) — used in CenterRisk batch unpaid count query
 *
 * center_ledgers:
 *   - (center_id, type) — used in FinancialLedgerService sum-by-type calculations
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!$this->indexExists('orders', 'idx_orders_center_status')) {
                $table->index(['center_id', 'status'], 'idx_orders_center_status');
            }
            if (!$this->indexExists('orders', 'idx_orders_center_due')) {
                $table->index(['center_id', 'due_amount'], 'idx_orders_center_due');
            }
        });

        Schema::table('center_ledgers', function (Blueprint $table) {
            if (!$this->indexExists('center_ledgers', 'idx_ledger_center_type')) {
                $table->index(['center_id', 'type'], 'idx_ledger_center_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if ($this->indexExists('orders', 'idx_orders_center_status')) {
                $table->dropIndex('idx_orders_center_status');
            }
            if ($this->indexExists('orders', 'idx_orders_center_due')) {
                $table->dropIndex('idx_orders_center_due');
            }
        });

        Schema::table('center_ledgers', function (Blueprint $table) {
            if ($this->indexExists('center_ledgers', 'idx_ledger_center_type')) {
                $table->dropIndex('idx_ledger_center_type');
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
