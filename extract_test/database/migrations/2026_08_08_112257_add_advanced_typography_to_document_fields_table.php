<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdvancedTypographyToDocumentFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('document_fields', 'z_index')) {
            Schema::table('document_fields', function (Blueprint $table) {
                $table->integer('z_index')->default(1);
                $table->string('letter_spacing')->nullable();
                $table->string('text_transform')->nullable();
                $table->string('text_shadow')->nullable();
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
        Schema::table('document_fields', function (Blueprint $table) {
            $table->dropColumn(['z_index', 'letter_spacing', 'text_transform', 'text_shadow']);
        });
    }
}
