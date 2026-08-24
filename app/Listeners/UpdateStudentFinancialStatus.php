<?php

namespace App\Listeners;

use App\Events\PaymentSucceeded;
use App\Jobs\SendPaymentConfirmationSmsJob;
use App\Models\Student;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class UpdateStudentFinancialStatus implements ShouldQueue
{
    /**
     * Handle the PaymentSucceeded event.
     * Updates the student's paid_amount, recalculates due_amount,
     * and flags payment_status as 'Paid' when due drops to zero.
     */
    public function handle(PaymentSucceeded $event): void
    {
        $payable = $event->payable;

        // Only handle Student payables — other types (Center, User) are handled elsewhere
        if (!($payable instanceof Student)) {
            return;
        }

        try {
            $student = Student::withoutGlobalScopes()->find($payable->id);

            if (!$student) {
                Log::warning('UpdateStudentFinancialStatus: Student not found', ['id' => $payable->id]);
                return;
            }

            $amount = (float) $event->transaction->amount;

            $student->paid_amount = ($student->paid_amount ?? 0) + $amount;
            $student->due_amount  = max(0, ($student->due_amount ?? 0) - $amount);

            if ($student->due_amount <= 0) {
                $student->payment_status = 1; // 1=Paid
            }

            $student->saveQuietly(); // avoid triggering Observers again

            Log::info('Student financial status updated after payment', [
                'student_id'     => $student->id,
                'amount_added'   => $amount,
                'new_paid'       => $student->paid_amount,
                'new_due'        => $student->due_amount,
                'payment_status' => $student->payment_status,
            ]);

            // Dispatch SMS confirmation job (async via queue)
            SendPaymentConfirmationSmsJob::dispatch($student, $event->transaction);

        } catch (\Exception $e) {
            Log::error('UpdateStudentFinancialStatus failed: ' . $e->getMessage(), [
                'student_id' => $payable->id ?? null,
                'trx_id'     => $event->transaction->trx_id,
            ]);
        }
    }
}
