<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckCenterFinancialRestrictions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'center:check-financial-restrictions';

    protected $description = 'Checks all centers and updates their financial restrictions based on due and credit limit.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $centers = \App\Models\Center::where('status', '!=', \App\Enums\CenterStatus::Suspended)->get();
        $restrictedCount = 0;

        foreach ($centers as $center) {
            if (!$center->auto_restriction) {
                continue; // Skip if auto restriction is disabled
            }

            $classification = $center->due_classification;
            
            if ($classification === 'CREDIT_LIMIT_REACHED' || $classification === 'RESTRICTED') {
                if ($center->status !== \App\Enums\CenterStatus::Pending) { // Or whatever status means restricted
                    // For now we just log, or trigger an event/notification
                    $this->info("Center {$center->code} reached credit limit.");
                    $restrictedCount++;
                    // $center->update(['status' => \App\Enums\CenterStatus::Suspended]); // If we want to suspend
                }
            }
        }

        $this->info("Checked " . $centers->count() . " centers. {$restrictedCount} are at/over limit.");
        return 0;
    }
}
