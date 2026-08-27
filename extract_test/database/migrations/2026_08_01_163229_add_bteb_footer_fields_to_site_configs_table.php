<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBtebFooterFieldsToSiteConfigsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('site_configs', function (Blueprint $table) {
            $table->string('footer_top_bg_image')->nullable();
            $table->string('footer_side_bg_image')->nullable();
            $table->text('footer_disclaimer_text')->nullable();
            $table->string('footer_planning_text')->nullable();
            $table->string('footer_tech_support_text')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_configs', function (Blueprint $table) {
            $table->dropColumn([
                'footer_top_bg_image',
                'footer_side_bg_image',
                'footer_disclaimer_text',
                'footer_planning_text',
                'footer_tech_support_text',
            ]);
        });
    }
}
