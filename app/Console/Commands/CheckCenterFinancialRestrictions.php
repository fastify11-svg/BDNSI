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

    public function handle(\App\Services\WorkflowAutomationService $workflowService)
    {
        $this->info("Running daily workflow automations...");
        $workflowService->runDailyAutomations();
        $this->info("Daily workflow automations completed successfully.");
        
        return 0;
    }
}
