<?php

namespace App\Services\Sms;

use App\Models\SmsGateway;

class SmsGatewayFactory
{
    /**
     * Get the appropriate SMS driver instance based on the gateway's slug or name.
     */
    public static function make(SmsGateway $gateway): SmsDriverInterface
    {
        $slug = strtolower($gateway->provider_name ?? '');

        return match ($slug) {
            'revesms', 'reve' => new ReveSmsDriver(),
            'twilio'          => new TwilioSmsDriver(),
            default           => new ReveSmsDriver(), // Default fallback
        };
    }
}
