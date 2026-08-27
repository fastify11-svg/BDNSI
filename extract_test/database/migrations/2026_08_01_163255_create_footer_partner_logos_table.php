<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFooterPartnerLogosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('footer_partner_logos')) {
            Schema::create('footer_partner_logos', function (Blueprint $table) {
                $table->id();
                $table->string('title')->nullable();
                $table->string('image_path');
                $table->string('url')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(1);
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
        Schema::dropIfExists('footer_partner_logos');
    }
}
