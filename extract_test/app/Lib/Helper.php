<?php

namespace App\Lib;

class Helper
{
    public static function serialNumber($id)
    {

        $number = '19524';
        $length = 9;

        // Convert $id to string to handle numeric IDs
        $id = (string) $id;

        // Calculate how much padding is needed
        $paddingLength = $length - strlen($id);

        // Create the padding from $number and concatenate with $id
        $paddedId = substr($number, 0, $paddingLength).$id;

        return $paddedId;
    }

    public static function certificateSerialNumber($id)
    {

        $number = '11224';
        $length = 9;

        // Convert $id to string to handle numeric IDs
        $id = (string) $id;

        // Calculate how much padding is needed
        $paddingLength = $length - strlen($id);

        // Create the padding from $number and concatenate with $id
        $paddedId = substr($number, 0, $paddingLength).$id;

        return $paddedId;
    }

    public static function numberToText($num)
    {

        $number = $num;

        $words = [
            0 => 'zero',
            1 => 'one',
            2 => 'two',
            3 => 'three',
            4 => 'four',
            5 => 'five',
            6 => 'six',
            7 => 'seven',
            8 => 'eight',
            9 => 'nine',
            10 => 'ten',
            11 => 'eleven',
            12 => 'twelve',
            13 => 'thirteen',
            14 => 'fourteen',
            15 => 'fifteen',
            16 => 'sixteen',
            17 => 'seventeen',
            18 => 'eighteen',
            19 => 'nineteen',
            20 => 'twenty',
            30 => 'thirty',
            40 => 'forty',
            50 => 'fifty',
            60 => 'sixty',
            70 => 'seventy',
            80 => 'eighty',
            90 => 'ninety',
        ];

        $units = [
            1 => 'thousand',
            2 => 'million',
            3 => 'billion',
        ];

        if ($number < 0) {
            return 'minus '.self::numberToText(abs($number));
        }

        if ($number < 21) {
            return $words[$number];
        }

        if ($number < 100) {
            $tens = (int) ($number / 10) * 10;
            $units = $number % 10;

            return $words[$tens].($units ? '-'.$words[$units] : '');
        }

        if ($number < 1000) {
            $hundreds = (int) ($number / 100);
            $remainder = $number % 100;

            return $words[$hundreds].' hundred'.($remainder ? ' '.self::numberToText($remainder) : '');
        }

        foreach ($units as $unitValue => $unitName) {
            $unitPower = pow(1000, $unitValue);
            if ($number < $unitPower * 1000) {
                $mainPart = (int) ($number / $unitPower);
                $remainder = $number % $unitPower;

                return self::numberToText($mainPart).' '.$unitName.($remainder ? ' '.self::numberToText($remainder) : '');
            }
        }

        return '';
    }

    public static function sendSms($phone, $message)
    {
        if (config('app.env') === 'testing' || config('app.env') === 'local') {
            \Illuminate\Support\Facades\Log::info("Mock SMS to {$phone}: {$message}");
            return;
        }

        $gateway = \App\Models\SmsGateway::where('is_active', true)->first();
        if (!$gateway) {
            \Illuminate\Support\Facades\Log::error("SMS Gateway not configured or inactive.");
            return;
        }

        $api_key = $gateway->api_key;
        
        try {
            $driver = \App\Services\Sms\SmsGatewayFactory::make($gateway);
            $driver->send($phone, $message, $gateway);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Helper::sendSms failed: " . $e->getMessage());
        }
    }
}
