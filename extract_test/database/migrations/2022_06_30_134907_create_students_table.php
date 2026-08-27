<?php

use App\Enums\StudentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('center_id')->constrained();
            $table->string('name');
            $table->string('fathers_name');
            $table->string('mothers_name');
            $table->string('roll')->nullable();
            $table->string('registration')->nullable();
            $table->string('date_of_birth');
            $table->unsignedTinyInteger('gender');
            $table->unsignedTinyInteger('blood_group')->nullable();
            $table->unsignedTinyInteger('religion');
            $table->string('present_address');
            $table->string('permanent_address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('course_duration')->nullable();
            $table->string('qualification')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('nid_or_birth')->nullable();
            $table->foreignId('session_id')->constrained();
            $table->foreignId('subject_id')->constrained();
            $table->string('picture')->nullable();
            $table->string('passport')->nullable();
            $table->unsignedTinyInteger('status')->default(StudentStatus::Pending);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
}
