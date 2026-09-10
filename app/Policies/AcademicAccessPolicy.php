<?php

namespace App\Policies;

use App\Models\Center;
use App\Models\Student;

class AcademicAccessPolicy
{
    /**
     * Determine if the center can publish/view a student's result.
     */
    public function publishResult(Center $center, Student $student): bool
    {
        if ($student->payment_status === 1 || $student->paid_amount >= $student->due_amount) {
            return true;
        }

        if ($center->allow_result_without_payment) {
            return $center->hasSufficientCredit(0); // must be within limit
        }

        return false;
    }

    /**
     * Determine if the center can download a student's certificate.
     */
    public function accessCertificate(Center $center, Student $student): bool
    {
        if ($student->payment_status === 1 || $student->paid_amount >= $student->due_amount) {
            return true;
        }

        if ($center->allow_certificate_without_payment) {
            return $center->hasSufficientCredit(0); // must be within limit
        }

        return false;
    }

    /**
     * Determine if the center can access a student's registration documents (ID card, Admit card, Registration form).
     */
    public function accessRegistrationDocuments(Center $center, Student $student): bool
    {
        if ($student->payment_status === 1 || $student->paid_amount >= $student->due_amount) {
            return true;
        }

        if ($center->allow_registration_without_payment) {
            $orderItem = \App\Models\OrderItem::where('itemable_id', $student->id)
                ->where('itemable_type', \App\Models\Student::class)
                ->where('product_type', 'registration')
                ->first();

            if ($orderItem) {
                $hasLedger = \App\Models\CenterLedger::where('reference_id', $orderItem->order_id)
                    ->where('reference_type', \App\Models\Order::class)
                    ->where('type', 'debit')
                    ->exists();
                return $hasLedger;
            }

            return true;
        }

        return false;
    }
}
