<?php

namespace App\Services;

use App\Models\StudentDocument;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use App\Notifications\DocumentApproved;
use App\Notifications\DocumentRejected;
use Exception;

class DocumentVerificationService
{
    /**
     * Approve a student document.
     */
    public function approveDocument(StudentDocument $document)
    {
        return DB::transaction(function () use ($document) {
            $document->status = 'Approved';
            $document->save();

            // Notify center
            if ($document->student && $document->student->center) {
                $document->student->center->notify(new DocumentApproved($document));
            }

            \App\Models\AuditLog::create([
                'user_id' => auth()->id() ?? 1,
                'event' => 'DOCUMENT_APPROVED',
                'auditable_type' => StudentDocument::class,
                'auditable_id' => $document->id,
                'new_values' => ['status' => 'Approved'],
                'ip_address' => request()->ip() ?? '127.0.0.1',
                'user_agent' => request()->userAgent() ?? 'System'
            ]);

            return $document;
        });
    }

    /**
     * Reject a student document.
     */
    public function rejectDocument(StudentDocument $document, string $reason)
    {
        return DB::transaction(function () use ($document, $reason) {
            $document->status = 'Rejected';
            $document->rejected_reason = $reason;
            $document->save();

            // Notify center
            if ($document->student && $document->student->center) {
                $document->student->center->notify(new DocumentRejected($document));
            }

            \App\Models\AuditLog::create([
                'user_id' => auth()->id() ?? 1,
                'event' => 'DOCUMENT_REJECTED',
                'auditable_type' => StudentDocument::class,
                'auditable_id' => $document->id,
                'new_values' => ['status' => 'Rejected', 'reason' => $reason],
                'ip_address' => request()->ip() ?? '127.0.0.1',
                'user_agent' => request()->userAgent() ?? 'System'
            ]);

            return $document;
        });
    }
}
