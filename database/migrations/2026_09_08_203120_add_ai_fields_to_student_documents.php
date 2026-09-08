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
        Schema::table('student_documents', function (Blueprint $table) {
            $table->integer('ai_confidence_score')->nullable();
            $table->string('ai_classification')->nullable();
            $table->boolean('ai_mismatch_detected')->default(false);
            $table->text('ai_mismatch_details')->nullable();
            $table->json('ai_extracted_data')->nullable();
            $table->timestamp('ai_analyzed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_documents', function (Blueprint $table) {
            $table->dropColumn([
                'ai_confidence_score',
                'ai_classification',
                'ai_mismatch_detected',
                'ai_mismatch_details',
                'ai_extracted_data',
                'ai_analyzed_at'
            ]);
        });
    }
};
