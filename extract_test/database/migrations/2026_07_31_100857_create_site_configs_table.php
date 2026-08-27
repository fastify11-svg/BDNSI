<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSiteConfigsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_configs', function (Blueprint $table) {
            $table->id();

            // Branding
            $table->string('portal_name')->nullable();
            $table->string('tagline')->nullable();
            $table->string('rjsc_id')->nullable();
            $table->string('header_logo')->nullable();
            $table->string('main_logo')->nullable();
            $table->string('favicon')->nullable();

            // Contact
            $table->string('hotline_phone')->nullable();
            $table->string('official_email')->nullable();
            $table->string('headquarter_address')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('linkedin_url')->nullable();

            // Content
            $table->text('marquee_notice')->nullable();
            $table->text('about_short')->nullable();
            $table->longText('about_full')->nullable();
            $table->longText('terms_conditions')->nullable();
            $table->longText('privacy_policy')->nullable();
            $table->string('footer_copyright')->nullable();

            // Feature Toggles
            $table->boolean('toggle_center_apply')->default(1);
            $table->boolean('toggle_result_verify')->default(1);
            $table->boolean('toggle_success_students')->default(1);
            $table->boolean('toggle_video_gallery')->default(1);
            $table->boolean('toggle_photo_gallery')->default(1);
            $table->boolean('toggle_verified_centers')->default(1);
            $table->boolean('toggle_sponsors')->default(1);
            $table->boolean('toggle_notice_board')->default(1);
            $table->boolean('toggle_contact_form')->default(1);
            $table->boolean('toggle_whatsapp')->default(1);

            // Theme Colors
            $table->string('primary_color')->nullable();
            $table->string('secondary_color')->nullable();
            $table->string('accent_color')->nullable();

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
        Schema::dropIfExists('site_configs');
    }
}
