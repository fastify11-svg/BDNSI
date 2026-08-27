<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentGateway;

class PaymentGatewaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $gateways = [
            [
                'name' => 'SSLCommerz',
                'slug' => 'sslcommerz',
                'is_sandbox' => true,
                'is_active' => false,
            ],
            [
                'name' => 'bKash',
                'slug' => 'bkash',
                'is_sandbox' => true,
                'is_active' => false,
            ],
            [
                'name' => 'Aamarpay',
                'slug' => 'aamarpay',
                'is_sandbox' => true,
                'is_active' => false,
            ]
        ];

        foreach ($gateways as $gateway) {
            PaymentGateway::updateOrCreate(['slug' => $gateway['slug']], $gateway);
        }
    }
}
