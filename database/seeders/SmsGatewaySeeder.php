<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SmsGatewaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\SmsGateway::updateOrCreate(
            ['provider_name' => 'ReveSMS'],
            [
                'base_url' => 'http://apismpp.revesms.com/sendtext',
                'api_key' => 'YOUR_API_KEY_HERE',
                'secret_key' => 'YOUR_SECRET_KEY_HERE',
                'sender_id' => 'YTTC',
                'is_active' => true,
            ]
        );
    }
}
