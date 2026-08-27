<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddWidthAndHeightToDocumentFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('document_fields', 'width')) {
            Schema::table('document_fields', function (Blueprint $table) {
                $table->string('width')->nullable()->after('color');
                $table->string('height')->nullable()->after('width');
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
            $table->dropColumn(['width', 'height']);
        });
    }
}
