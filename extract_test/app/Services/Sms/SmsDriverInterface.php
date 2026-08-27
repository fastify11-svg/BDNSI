<?php

namespace App\Services\Sms;

use App\Models\SmsGateway;

interface SmsDriverInterface
{
    /**
     * Send an SMS message to a phone number.
     *
     * @param string $phone The recipient's phone number
     * @param string $message The message body
     * @param SmsGateway $gateway The configured gateway model
     * @return bool True if successful, false otherwise
     */
    public function send(string $phone, string $message, SmsGateway $gateway): bool;
}
