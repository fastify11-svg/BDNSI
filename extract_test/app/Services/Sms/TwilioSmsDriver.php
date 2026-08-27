<?php

namespace App\Services\Sms;

use App\Models\SmsGateway;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class TwilioSmsDriver implements SmsDriverInterface
{
    public function send(string $phone, string $message, SmsGateway $gateway): bool
    {
        $sid   = $gateway->api_key; // Twilio Account SID
        $token = $gateway->secret_key; // Twilio Auth Token
        $from  = $gateway->sender_id; // Twilio Phone Number

        if (empty($sid) || empty($token) || empty($from)) {
            Log::error("TwilioSmsDriver: Missing SID, Token, or Sender ID.");
            return false;
        }

        $url = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";

        try {
            $response = Http::withBasicAuth($sid, $token)->post($url, [
                'From' => $from,
                'To'   => $phone,
                'Body' => $message,
            ]);

            if ($response->successful()) {
                return true;
            }

            Log::error("TwilioSmsDriver API Error: " . $response->body());
            return false;

        } catch (\Exception $e) {
            Log::error("TwilioSmsDriver Exception: " . $e->getMessage());
            return false;
        }
    }
}
