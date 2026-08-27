<?php

namespace Database\Seeders;

use App\Models\ConfigDictionary;
use App\Models\SiteConfig;
use Illuminate\Database\Seeder;

class ConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Base config dictionary values
        $defaultConfig = [
            'site_name' => 'BDNSI',
            'site_phone' => '01XXXXXXXXX',
            'site_email' => 'info@bdnsi.gov.bd',
            'toggle_center_apply' => '1',
            'toggle_result_verify' => '1',
            'toggle_success_students' => '1',
            'toggle_video_gallery' => '1',
            'toggle_photo_gallery' => '1',
            'toggle_verified_centers' => '1',
            'toggle_sponsors' => '1',
            'toggle_notice_board' => '1',
            'toggle_contact_form' => '1',
            'toggle_whatsapp' => '1',
        ];

        foreach ($defaultConfig as $key => $value) {
            ConfigDictionary::set($key, $value, false); // false = don't bust cache on every loop
        }
        ConfigDictionary::storeCache();

        // SiteConfig values
        SiteConfig::firstOrCreate(
            ['id' => 1],
            [
                'portal_name' => 'BDNSI',
                'tagline' => 'Skill Development for All',
                'hotline_phone' => '01XXXXXXXXX',
                'official_email' => 'info@bdnsi.gov.bd',
            ]
        );
    }
}
