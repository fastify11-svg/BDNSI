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
        if (!Schema::hasTable('grade_scales')) {
            Schema::create('grade_scales', function (Blueprint $table) {
                $table->id();
                $table->tinyInteger('course_type')->unique(); // 0=Regular, 1=Short, 2=Diploma
                $table->integer('max_marks')->default(100);
                $table->json('rules')->nullable(); 
                // example: [{"min_percent": 80, "max_percent": 100, "grade": "A+"}]
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_scales');
    }
};
