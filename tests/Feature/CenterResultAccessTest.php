<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Student;
use App\Models\Session;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\LaratrustSeeder;

class CenterResultAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LaratrustSeeder::class);
    }

    public function test_center_cannot_access_unpaid_results_without_credit()
    {
        $center = Center::factory()->create([
            'credit_enabled' => false,
            'allow_result_without_payment' => false,
        ]);

        $user = User::factory()->create([
            'center_id' => $center->id,
            'username' => 'centeruser1',
            'phone' => '01700000001',
        ]);

        $session = Session::firstOrCreate(['name' => 'Test Session']);
        $subject = Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'payment_status' => 0, // Unpaid
            'due_amount' => 1000,
            'paid_amount' => 0,
        ]);

        $response = $this->actingAs($user)->get(route('centerStudentResult', [
            'session_id' => $session->id,
            'subject_id' => $subject->id,
        ]));

        $response->assertStatus(200);

        $response->assertInertia(function ($page) use ($student) {
            $page->component('Center/Student/Result')
                 ->has('students', 1, function ($p) use ($student) {
                     $p->where('id', $student->id)
                       ->where('result_error', 'Result blocked due to unpaid balance and insufficient credit limit.')
                       ->etc();
                 });
        });
    }

    public function test_center_can_access_unpaid_results_if_credit_enabled()
    {
        $center = Center::factory()->create([
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 0, // Has 5000 credit available
            'allow_result_without_payment' => true,
        ]);

        $user = User::factory()->create([
            'center_id' => $center->id,
            'username' => 'centeruser2',
            'phone' => '01700000002',
        ]);

        $session = Session::firstOrCreate(['name' => 'Test Session']);
        $subject = Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'payment_status' => 0, // Unpaid
            'due_amount' => 1000,
            'paid_amount' => 0,
        ]);

        $student->result()->create([
            'written' => 50,
            'mcq' => 25,
            'practical' => 25,
            'viva' => 0,
            'gpa' => '5.00', 
            'total_mark' => 100
        ]);

        $response = $this->actingAs($user)->get(route('centerStudentResult', [
            'session_id' => $session->id,
            'subject_id' => $subject->id,
        ]));

        $response->assertStatus(200);

        // Inertia response should have result object (not error string)
        $response->assertInertia(function ($page) use ($student) {
            $page->component('Center/Student/Result')
                 ->has('students', 1, function ($p) use ($student) {
                     $p->where('id', $student->id)
                       ->where('result.written', 50)
                       ->etc();
                 });
        });
    }
}
