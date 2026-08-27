<?php

namespace App\Jobs;

use App\Models\Student;
use App\Models\Transaction;
use App\Lib\Helper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendPaymentConfirmationSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 30;

    public function __construct(
        public readonly Student $student,
        public readonly Transaction $transaction
    ) {}

    public function handle(): void
    {
        try {
            $trx_id = $this->transaction->trx_id;
            $lockKey = "sms_payment_conf_tx_{$this->transaction->id}_{$trx_id}";

            // Ensure we only process this once per transaction (Idempotency)
            if (! \Illuminate\Support\Facades\Cache::add($lockKey, true, 86400)) {
                Log::info('SendPaymentConfirmationSmsJob: Idempotency lock active, skipping duplicate SMS', [
                    'trx_id' => $trx_id,
                ]);
                return;
            }

            $phone = $this->student->phone;

            if (empty($phone)) {
                Log::warning('SendPaymentConfirmationSmsJob: Student has no phone', [
                    'student_id' => $this->student->id,
                ]);
                // Release lock because we didn't actually send it (or keep it since no phone means it will never send?)
                // Actually if they update their phone, a retry might work. Let's release it.
                \Illuminate\Support\Facades\Cache::forget($lockKey);
                return;
            }

            $amount   = number_format((float) $this->transaction->amount, 2);
            $name     = $this->student->name;
            $siteName = config('site.setting.name', 'BDNSI');

            $message = "Payment Confirmed! Dear {$name}, your payment of BDT {$amount} has been received successfully. "
                . "Transaction ID: {$trx_id}. Thank you for your payment. - {$siteName}";

            Helper::sendSms($phone, $message);

            Log::info('Payment confirmation SMS sent', [
                'student_id' => $this->student->id,
                'trx_id'     => $trx_id,
                'phone'      => substr($phone, 0, 5) . '******', // masked for log
            ]);

        } catch (\Exception $e) {
            // Release the lock so a retry can attempt to send the SMS again
            if (isset($lockKey)) {
                \Illuminate\Support\Facades\Cache::forget($lockKey);
            }
            Log::error('SendPaymentConfirmationSmsJob failed: ' . $e->getMessage(), [
                'student_id' => $this->student->id,
                'trx_id'     => $this->transaction->trx_id,
            ]);
            $this->fail($e);
        }
    }
}
