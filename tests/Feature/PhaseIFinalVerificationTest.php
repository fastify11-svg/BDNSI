<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\Transaction;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class PhaseIFinalVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_workflow_automation_suspends_critical_risk_center()
    {
        $center = Center::factory()->create([
            'status' => \App\Enums\CenterStatus::Approved,
            'credit_enabled' => true,
            'credit_limit' => 1000,
            'current_due' => 1500, // Sync with ledger below
        ]);

        \App\Models\CenterLedger::create([
            'center_id' => $center->id,
            'type' => 'debit',
            'amount' => 1500,
            'balance_after' => 1500,
            'description' => 'Test Debt'
        ]);

        for ($i = 0; $i < 51; $i++) {
            Order::create([
                'center_id' => $center->id,
                'status' => 'partially_paid',
                'order_number' => 'ORD-' . rand(1000, 9999) . $i,
                'amount' => 100,
                'due_amount' => 10,
                'paid_amount' => 90
            ]);
        }

        $service = app(\App\Services\WorkflowAutomationService::class);
        $riskService = app(\App\Services\CenterRiskService::class);
        dump('Score: ' . $riskService->evaluateRisk($center)['score']);
        dump('Utilization: ' . $riskService->evaluateRisk($center)['utilization']);
        
        $service->runDailyAutomations();

        $center->refresh();
        $this->assertEquals(\App\Enums\CenterStatus::Suspended, $center->status->value);
    }

    public function test_audit_log_records_ledger_mutation()
    {
        $center = Center::factory()->create(['current_due' => 0]);
        $order = Order::create([
            'center_id' => $center->id,
            'status' => 'pending',
            'order_number' => 'ORD-12345',
            'amount' => 1000,
            'due_amount' => 1000,
            'paid_amount' => 0
        ]);

        $service = app(\App\Services\FinancialLedgerService::class);
        $service->recordOrder($center, $order, 1000, 'Test order');

        $this->assertDatabaseHas('audit_logs', [
            'event' => 'LEDGER_DEBIT',
            'auditable_type' => \App\Models\CenterLedger::class,
        ]);
    }

    public function test_audit_log_records_document_approval()
    {
        $center = Center::factory()->create();
        $session = \App\Models\Session::firstOrCreate(['name' => '2025-2026', 'status' => 1]);
        $student = Student::factory()->create(['center_id' => $center->id, 'session_id' => $session->id]);
        $document = StudentDocument::create([
            'student_id' => $student->id,
            'document_type_id' => 1,
            'file_path' => 'dummy.pdf',
            'status' => 'Pending'
        ]);

        $service = app(\App\Services\DocumentVerificationService::class);
        $service->approveDocument($document);

        $this->assertDatabaseHas('audit_logs', [
            'event' => 'DOCUMENT_APPROVED',
            'auditable_type' => StudentDocument::class,
            'auditable_id' => $document->id
        ]);
    }
}
