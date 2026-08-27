<?php

use App\Models\ConfigDictionary;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $defaults = [
            // Branding
            'site_name' => 'BDNSI',
            'site_tagline' => 'Quality Skill Education Across Bangladesh',
            'site_phone' => '09649700002',
            'site_address' => 'Dhaka, Bangladesh',
            'site_email' => 'info@bdnsi.com',
            'site_rjsc' => '',
            'copyright_text' => '© 2025 BDNSI. All rights reserved.',

            // Module Toggles (1 = ON, 0 = OFF)
            'module_center_apply' => '1',
            'module_student_result' => '1',
            'module_success_students' => '1',
            'module_video_gallery' => '1',
            'module_photo_gallery' => '1',
            'module_verified_centers' => '1',
            'module_sponsors' => '1',
            'module_notice_ticker' => '1',
            'module_contact_us' => '1',
            'module_whatsapp' => '1',

            // Theme Colors
            'primary_color' => '#7024A8',
            'secondary_color' => '#581C87',
            'accent_color' => '#F59E0B',
        ];

        foreach ($defaults as $key => $value) {
            if (! ConfigDictionary::where('key', $key)->exists()) {
                ConfigDictionary::set($key, $value, false);
            }
        }
        ConfigDictionary::storeCache();
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
            'module_contact_us', 'module_whatsapp',
            'primary_color', 'secondary_color', 'accent_color',
        ];

        ConfigDictionary::whereIn('key', $keys)->delete();
        ConfigDictionary::bustCache();
    }
};
