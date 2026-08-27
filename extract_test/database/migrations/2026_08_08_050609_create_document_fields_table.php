<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('document_fields')) {
            Schema::create('document_fields', function (Blueprint $table) {
                $table->id();
                $table->foreignId('document_template_id')->constrained('document_templates')->onDelete('cascade');
                $table->string('variable_key'); // e.g. student_name
                $table->string('position_x')->default('0px');
                $table->string('position_y')->default('0px');
                $table->string('font_size')->nullable();
                $table->string('font_family')->nullable();
                $table->string('font_weight')->nullable();
                $table->string('color')->nullable();
                $table->string('text_align')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('document_fields');
    }
}
