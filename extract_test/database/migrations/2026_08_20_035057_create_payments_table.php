<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->nullable()->constrained()->onDelete('set null');
                $table->foreignId('center_id')->nullable()->constrained()->onDelete('set null');
                $table->decimal('amount', 10, 2)->default(0);
                $table->string('purpose')->default('registration_fee'); // registration_fee, certificate_sale
                $table->string('status')->default('pending'); // pending, paid, failed
                $table->string('transaction_id')->nullable();
                $table->string('payment_method')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
