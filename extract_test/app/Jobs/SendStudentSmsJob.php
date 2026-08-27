<?php

namespace App\Jobs;

use App\Lib\Helper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendStudentSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 30;

    public $phone;

    public $message;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($phone, $message)
    {
        $this->phone = $phone;
        $this->message = $message;
        $this->queue = 'high';
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            Helper::sendSms($this->phone, $this->message);
        } catch (Throwable $e) {
            Log::error('SMS dispatch error', [
                'phone' => $this->phone,
                'error' => $e->getMessage(),
            ]);
            $this->fail($e);
        }
    }

    /**
     * Handle a job failure.
     *
     * @return void
     */
    public function failed(Throwable $exception)
    {
        if (config('logging.channels.slack.url')) {
            Log::channel('slack')->critical('SMS dispatch failed!', [
                'phone' => $this->phone,
                'error' => $exception->getMessage(),
            ]);
        } else {
            Log::error('SMS dispatch failed (Slack not configured)', [
                'phone' => $this->phone,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
