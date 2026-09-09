<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPerformanceIndexesToOrdersAndPaymentsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index('status', 'orders_status_index');
            $table->index('created_at', 'orders_created_at_index');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index('status', 'payments_status_index');
            $table->index('created_at', 'payments_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_status_index');
            $table->dropIndex('orders_created_at_index');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_status_index');
            $table->dropIndex('payments_created_at_index');
        });
    }
}
