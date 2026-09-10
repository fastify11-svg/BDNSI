<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendPaymentReminders implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Find centers with dues > 80% of limit, using cursor() to prevent memory exhaustion
        $centers = \App\Models\Center::where('credit_enabled', true)
            ->where('current_due', '>', 0)
            ->cursor();

        foreach ($centers as $center) {
            $classification = $center->due_classification;
            if (in_array($classification, ['CREDIT_LIMIT_WARNING', 'CREDIT_LIMIT_REACHED'])) {
                // Send due warning
                $center->notify(new \App\Notifications\DueWarning($center->current_due, $center->credit_limit));
            }
        }
    }
}
