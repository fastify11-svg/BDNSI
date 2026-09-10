<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAnalyticsCompositeIndexesToTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('sessions', 'exam_date')) {
                $table->date('exam_date')->nullable();
            }
            if (!$this->indexExists('sessions', 'idx_sessions_exam_date')) {
                $table->index('exam_date', 'idx_sessions_exam_date');
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
        Schema::table('sessions', function (Blueprint $table) {
            if ($this->indexExists('sessions', 'idx_sessions_exam_date')) {
                $table->dropIndex('idx_sessions_exam_date');
            }
        });
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $connection = Schema::getConnection();
        $dbName = $connection->getDatabaseName();
        $result = $connection->select(
            "SELECT COUNT(*) as cnt FROM information_schema.statistics
             WHERE table_schema = ? AND table_name = ? AND index_name = ?",
            [$dbName, $table, $indexName]
        );
        return $result[0]->cnt > 0;
    }
}
