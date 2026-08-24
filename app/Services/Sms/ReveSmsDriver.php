<?php

namespace App\Services\Sms;

use App\Models\SmsGateway;
use Illuminate\Support\Facades\Log;

class ReveSmsDriver implements SmsDriverInterface
{
    public function send(string $phone, string $message, SmsGateway $gateway): bool
    {
        $api_key    = $gateway->api_key;
        $secret_key = $gateway->secret_key;
        $sender_id  = $gateway->sender_id;
        $base_url   = rtrim($gateway->base_url, '/');

        $url = $base_url . '?apikey=' . urlencode($api_key) .
            '&secretkey=' . urlencode($secret_key) .
            '&callerID=' . urlencode($sender_id) .
            '&toUser=' . urlencode($phone) .
            '&messageContent=' . urlencode($message);

        if (empty($api_key) || empty($base_url)) {
            Log::error("ReveSmsDriver: Missing API key or Base URL.");
            return false;
        }

        try {
            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_TIMEOUT, 10);
            
            $result = curl_exec($curl);
            
            if (curl_errno($curl)) {
                Log::error("ReveSmsDriver cURL Error: " . curl_error($curl));
                curl_close($curl);
                return false;
            }

            curl_close($curl);
            
            // Assume success if no cURL error, though you might parse $result here
            return true;

        } catch (\Exception $e) {
            Log::error("ReveSmsDriver Exception: " . $e->getMessage());
            return false;
        }
    }
}
