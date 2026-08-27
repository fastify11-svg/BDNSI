<?php

namespace Database\Seeders;

use App\Models\ConfigDictionary;
use App\Models\SiteConfig;
use Illuminate\Database\Seeder;

class SiteConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $config = SiteConfig::create([
            'portal_name' => 'Central Site Control Center',
            'tagline' => 'Managing the site effectively',
            'rjsc_id' => 'RJSC-12345',
            'header_logo' => 'default_header_logo.png',
            'main_logo' => 'default_main_logo.png',
            'favicon' => 'default_favicon.ico',

            'hotline_phone' => '+1234567890',
            'official_email' => 'contact@example.com',
            'headquarter_address' => '123 Main Street, City',
            'facebook_url' => 'https://facebook.com',
            'youtube_url' => 'https://youtube.com',
            'twitter_url' => 'https://twitter.com',
            'linkedin_url' => 'https://linkedin.com',

            'marquee_notice' => 'Welcome to the Central Site Control Center!',
            'about_short' => 'Short about us.',
            'about_full' => 'Full about us description goes here.',
            'terms_conditions' => 'Terms and conditions go here.',
            'privacy_policy' => 'Privacy policy goes here.',
            'footer_copyright' => '© 2026 Central Site. All rights reserved.',

            'toggle_center_apply' => 1,
            'toggle_result_verify' => 1,
            'toggle_success_students' => 1,
            'toggle_video_gallery' => 1,
            'toggle_photo_gallery' => 1,
            'toggle_verified_centers' => 1,
            'toggle_sponsors' => 1,
            'toggle_notice_board' => 1,
            'toggle_contact_form' => 1,
            'toggle_whatsapp' => 1,

            'primary_color' => '#7024A8',
            'secondary_color' => '#3B82F6',
            'accent_color' => '#F59E0B',
        ]);

        $attributes = $config->getAttributes();
        foreach ($attributes as $key => $value) {
            if (! in_array($key, ['id', 'created_at', 'updated_at'])) {
                ConfigDictionary::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value ?? '']
                );
            }
        }
        ConfigDictionary::storeCache();
    }
}
