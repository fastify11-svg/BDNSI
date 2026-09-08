<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Role;
use App\Models\Center;
use App\Models\Commission;
use App\Models\CommissionPolicy;
use App\Models\Order;
use App\Models\PaymentGateway;
use App\Models\Team;
use App\Models\Transaction;
use App\Services\CommissionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhaseLCommissionLifecycleTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $agent;
    protected $agent2;
    protected $center;
    protected $order;
    protected $policy;
    protected $commissionService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->commissionService = app(CommissionService::class);
        
        $this->admin = Admin::factory()->create();
        $role = Role::firstOrCreate(['name' => 'admin']);
        $this->admin->attachRole($role);

        $this->agent = Team::create([
            'name' => 'Agent 1',
            'is_active' => true,
        ]);
        
        $this->agent2 = Team::create([
            'name' => 'Agent 2',
            'is_active' => true,
        ]);

        $this->center = Center::factory()->create([
            'team_id' => $this->agent->id,
        ]);

        $this->order = Order::create([
            'center_id' => $this->center->id,
            'order_number' => 'ORD-TEST-1',
            'payable_amount' => 1000,
            'paid_amount' => 0,
            'due_amount' => 1000,
            'status' => 'pending',
            'total_amount' => 1000,
        ]);

        $this->policy = CommissionPolicy::create([
            'name' => '10% Agent Commission',
            'type' => 'percentage',
            'value' => 10.00,
            'team_id' => null, // Global
            'is_active' => true,
        ]);
        
        PaymentGateway::create([
            'name' => 'manual', 
            'slug' => 'manual',
            'is_active' => true
        ]);
    }

    public function test_it_calculates_commission_on_transaction()
    {
        $transaction = Transaction::create([
            'trx_id' => 'TXN-TEST-1',
            'payable_type' => Center::class,
            'payable_id' => $this->center->id,
            'amount' => 1000,
            'status' => 'success',
            'gateway' => 'manual',
            'purpose' => 'order_payment',
        ]);

        $this->commissionService->calculateAndRecord($this->order, $transaction, 1000);

        $this->assertDatabaseHas('commissions', [
            'team_id' => $this->agent->id,
            'order_id' => $this->order->id,
            'transaction_id' => $transaction->id,
            'amount' => 100.00, // 10% of 1000
            'status' => Commission::STATUS_EARNED,
        ]);
    }

    public function test_it_calculates_fixed_commission_and_is_idempotent()
    {
        $this->policy->update(['type' => 'fixed', 'value' => 150]);

        $transaction = Transaction::create([
            'trx_id' => 'TXN-TEST-2',
            'payable_type' => Center::class,
            'payable_id' => $this->center->id,
            'amount' => 1000,
            'status' => 'success',
            'gateway' => 'manual',
            'purpose' => 'order_payment',
        ]);

        // First call
        $this->commissionService->calculateAndRecord($this->order, $transaction, 1000);
        
        // Second call (idempotency check)
        $this->commissionService->calculateAndRecord($this->order, $transaction, 1000);

        // Should only be one commission
        $this->assertEquals(1, Commission::where('transaction_id', $transaction->id)->count());
        $this->assertEquals(150, Commission::first()->amount);
    }

    public function test_admin_can_approve_and_pay_commission()
    {
        $transaction = Transaction::create([
            'trx_id' => 'TXN-TEST-3',
            'payable_type' => Center::class,
            'payable_id' => $this->center->id,
            'amount' => 1000,
            'status' => 'success',
            'gateway' => 'manual',
            'purpose' => 'order_payment',
        ]);

        $commission = Commission::create([
            'team_id' => $this->agent->id,
            'order_id' => $this->order->id,
            'transaction_id' => $transaction->id,
            'commission_policy_id' => $this->policy->id,
            'calculated_revenue' => 1000,
            'amount' => 100,
            'status' => Commission::STATUS_EARNED,
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.commissions.approve', $commission->id));
        
        $response->assertRedirect();
        $this->assertEquals(Commission::STATUS_APPROVED, $commission->fresh()->status);

        $responsePay = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.commissions.pay', $commission->id));
        
        $responsePay->assertRedirect();
        $this->assertEquals(Commission::STATUS_PAID, $commission->fresh()->status);
    }

    public function test_staff_idor_protection_for_commissions()
    {
        $transaction = Transaction::create([
            'trx_id' => 'TXN-TEST-4',
            'payable_type' => Center::class,
            'payable_id' => $this->center->id,
            'amount' => 1000,
            'status' => 'success',
            'gateway' => 'manual',
            'purpose' => 'order_payment',
        ]);

        $commission = Commission::create([
            'team_id' => $this->agent->id,
            'order_id' => $this->order->id,
            'transaction_id' => $transaction->id,
            'commission_policy_id' => $this->policy->id,
            'calculated_revenue' => 1000,
            'amount' => 100,
            'status' => Commission::STATUS_EARNED,
        ]);

        // Staff viewing their own commissions
        $response = $this->actingAs($this->agent, 'staff')
            ->get(route('staff.commission.index'));
        
        $response->assertStatus(200);
        $response->assertSee('100'); // Sees amount

        // Another agent logs in, should NOT see agent1's commission
        $response2 = $this->actingAs($this->agent2, 'staff')
            ->get(route('staff.commission.index'));
        
        $response2->assertStatus(200);
        // Inertia passes props, we check JSON response for data
        $page = $response2->viewData('page');
        $this->assertEmpty($page['props']['commissions']['data']);
    }
}
