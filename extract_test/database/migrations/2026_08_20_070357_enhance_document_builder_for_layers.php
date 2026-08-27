<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EnhanceDocumentBuilderForLayers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('document_templates', function (Blueprint $table) {
            $table->string('background_color')->nullable()->default('#ffffff');
        });

        Schema::table('document_fields', function (Blueprint $table) {
            $table->longText('content')->nullable();
            $table->string('element_type')->nullable(); // e.g. dynamic, static_text, static_image
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('document_fields', function (Blueprint $table) {
            $table->dropColumn(['content', 'element_type']);
        });

        Schema::table('document_templates', function (Blueprint $table) {
            $table->dropColumn('background_color');
        });
    }
}
