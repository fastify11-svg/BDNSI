<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Student;
use App\Policies\AcademicAccessPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreditLimitPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_denies_result_if_unpaid_and_no_credit_allowance()
    {
        $center = Center::factory()->create([
            'allow_result_without_payment' => false,
        ]);

        $subject = \App\Models\Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);
        $session = \App\Models\Session::firstOrCreate(['name' => 'Test Session']);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'subject_id' => $subject->id,
            'session_id' => $session->id,
            'payment_status' => 0,
            'due_amount' => 1000,
            'paid_amount' => 0,
        ]);

        $policy = new AcademicAccessPolicy();
        $this->assertFalse($policy->publishResult($center, $student));
    }

    public function test_it_allows_result_if_unpaid_but_has_credit_allowance_and_limit()
    {
        $center = Center::factory()->create([
            'allow_result_without_payment' => true,
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 1000,
        ]);

        $subject = \App\Models\Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);
        $session = \App\Models\Session::firstOrCreate(['name' => 'Test Session']);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'subject_id' => $subject->id,
            'session_id' => $session->id,
            'payment_status' => 0,
            'due_amount' => 1000,
            'paid_amount' => 0,
        ]);

        $policy = new AcademicAccessPolicy();
        $this->assertTrue($policy->publishResult($center, $student));
    }

    public function test_it_denies_result_if_unpaid_and_credit_limit_exceeded()
    {
        $center = Center::factory()->create([
            'allow_result_without_payment' => true,
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 6000, // Exceeds limit
        ]);

        $subject = \App\Models\Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);
        $session = \App\Models\Session::firstOrCreate(['name' => 'Test Session']);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'subject_id' => $subject->id,
            'session_id' => $session->id,
            'payment_status' => 0,
            'due_amount' => 1000,
            'paid_amount' => 0,
        ]);

        $policy = new AcademicAccessPolicy();
        $this->assertFalse($policy->publishResult($center, $student));
    }
}
