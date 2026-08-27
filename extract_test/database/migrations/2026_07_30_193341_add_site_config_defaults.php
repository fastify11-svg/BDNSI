<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddSiteConfigDefaults extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $defaults = [
            ['key' => 'site_name', 'value' => 'Young Technical Training Centre'],
            ['key' => 'site_tagline', 'value' => 'Quality skill education across Bangladesh'],
            ['key' => 'site_phone', 'value' => '09649700002'],
            ['key' => 'site_address', 'value' => 'Dhaka, Bangladesh'],
            ['key' => 'site_email', 'value' => 'info@bdnsi.com'],
            ['key' => 'site_rjsc', 'value' => '123456'],
            ['key' => 'copyright_text', 'value' => '© 2026 Young Technical Training Centre. All rights reserved.'],
            ['key' => 'module_center_apply', 'value' => '1'],
            ['key' => 'module_student_result', 'value' => '1'],
            ['key' => 'module_success_students', 'value' => '1'],
            ['key' => 'module_video_gallery', 'value' => '1'],
            ['key' => 'module_photo_gallery', 'value' => '1'],
            ['key' => 'module_verified_centers', 'value' => '1'],
            ['key' => 'module_sponsors', 'value' => '1'],
            ['key' => 'module_notice_ticker', 'value' => '1'],
            ['key' => 'module_contact_us', 'value' => '1'],
            ['key' => 'module_whatsapp', 'value' => '1'],
            ['key' => 'homepage_section_order', 'value' => '[]'],
            ['key' => 'primary_color', 'value' => '#7024A8'],
            ['key' => 'secondary_color', 'value' => '#581C87'],
            ['key' => 'accent_color', 'value' => '#FBBF24'],
        ];

        foreach ($defaults as $default) {
            DB::table('config_dictionaries')->updateOrInsert(
                ['key' => $default['key']],
                ['value' => json_encode($default['value'])]
            );
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $keys = [
            'site_name', 'site_tagline', 'site_phone', 'site_address', 'site_email', 'site_rjsc', 'copyright_text',
            'module_center_apply', 'module_student_result', 'module_success_students', 'module_video_gallery',
            'module_photo_gallery', 'module_verified_centers', 'module_sponsors', 'module_notice_ticker',
            'module_contact_us', 'module_whatsapp', 'homepage_section_order', 'primary_color', 'secondary_color', 'accent_color',
        ];

        DB::table('config_dictionaries')->whereIn('key', $keys)->delete();
    }
}
