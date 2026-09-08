<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Center;
use App\Models\User;
use App\Notifications\CenterSuspended;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PhaseMAutomationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $admin = Admin::factory()->create();
    }

    /** @test */
    public function workflow_automation_suspends_critical_risk_center_and_sends_notifications()
    {
        Notification::fake();

        // Create a center with 100% utilization and high risk
        $center = Center::factory()->create([
            'status' => \App\Enums\CenterStatus::Approved,
            'credit_enabled' => true,
            'credit_limit' => 10000,
            'current_due' => 10000,
            // Mocking other risk factors might be needed depending on CenterRiskService
        ]);
        
        // Let's mock CenterRiskService so we don't have to create 50 students
        $mockRiskService = \Mockery::mock(\App\Services\CenterRiskService::class);
        $mockRiskService->shouldReceive('evaluateRisk')->andReturn([
            'utilization' => 100,
            'score' => 75 // High risk
        ]);

        $workflowService = new \App\Services\WorkflowAutomationService($mockRiskService);
        
        // Execute automation
        $workflowService->runDailyAutomations();

        // Assert center is suspended
        $center->refresh();
        $this->assertEquals(\App\Enums\CenterStatus::Suspended, is_object($center->status) ? $center->status->value : $center->status);

        // Assert audit log is created
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'AUTO_SUSPEND',
            'auditable_type' => get_class($center),
            'auditable_id' => $center->id,
        ]);

        // Assert notification sent to center
        Notification::assertSentTo(
            [$center],
            CenterSuspended::class
        );

        // Assert notification sent to admin
        $admin = Admin::first();
        Notification::assertSentTo(
            [$admin],
            CenterSuspended::class
        );
    }
    
    /** @test */
    public function command_runs_workflow_automation()
    {
        $mockWorkflowService = \Mockery::mock(\App\Services\WorkflowAutomationService::class);
        $mockWorkflowService->shouldReceive('runDailyAutomations')->once();

        // Inject the mock into the container
        $this->app->instance(\App\Services\WorkflowAutomationService::class, $mockWorkflowService);

        $this->artisan('center:check-financial-restrictions')
            ->expectsOutput('Running daily workflow automations...')
            ->expectsOutput('Daily workflow automations completed successfully.')
            ->assertExitCode(0);
    }
}
