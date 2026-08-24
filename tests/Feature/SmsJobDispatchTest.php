<?php

namespace Tests\Feature;

use App\Enums\StudentStatus;
use App\Events\PaymentSucceeded;
use App\Jobs\SendPaymentConfirmationSmsJob;
use App\Jobs\SendStudentSmsJob;
use App\Models\Student;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SmsJobDispatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_sms_job_dispatched_on_approval()
    {
        Queue::fake();

        $center = \App\Models\Center::firstOrCreate(
            ['code' => 'T1'],
            ['name' => 'Test Center', 'owner_name' => 'Test Owner', 'email' => 't1@example.com', 'password' => bcrypt('password')]
        );
        $subject = \App\Models\Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);
        $session = \App\Models\Session::firstOrCreate(['name' => 'Test Session']);

        $student = Student::factory()->create([
            'status' => 0, // Pending
            'center_id' => $center->id,
            'subject_id' => $subject->id,
            'session_id' => $session->id,
            'fathers_name' => 'Test Father',
            'mothers_name' => 'Test Mother',
            'date_of_birth' => '2000-01-01',
            'present_address' => 'Present Address',
            'permanent_address' => 'Permanent Address',
        ]);

        $student->status = 2; // Approved
        $student->save();

        Queue::assertPushed(SendStudentSmsJob::class, function ($job) use ($student) {
            return $job->phone === $student->phone;
        });
    }

    public function test_payment_confirmation_sms_job_dispatched_on_payment_success()
    {
        Queue::fake();

        $center = \App\Models\Center::firstOrCreate(
            ['code' => 'T2'],
            ['name' => 'Test Center 2', 'owner_name' => 'Test Owner', 'email' => 't2@example.com', 'password' => bcrypt('password')]
        );
        $subject = \App\Models\Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);
        $session = \App\Models\Session::firstOrCreate(['name' => 'Test Session']);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'subject_id' => $subject->id,
            'session_id' => $session->id,
            'fathers_name' => 'Test Father',
            'mothers_name' => 'Test Mother',
            'date_of_birth' => '2000-01-01',
            'present_address' => 'Present Address',
            'permanent_address' => 'Permanent Address',
        ]);

        $transaction = \App\Models\Transaction::create([
            'trx_id' => 'TRX_' . time(),
            'amount' => 100,
            'payable_type' => get_class($student),
            'payable_id' => $student->id,
            'status' => 'success',
        ]);

        $event = new PaymentSucceeded($transaction, $student);
        $listener = new \App\Listeners\UpdateStudentFinancialStatus();
        $listener->handle($event);

        Queue::assertPushed(SendPaymentConfirmationSmsJob::class);
    }
}
