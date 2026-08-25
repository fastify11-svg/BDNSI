<?php

namespace App\Policies;

use App\Models\Center;
use App\Models\StudentDocument;

class DocumentAccessPolicy
{
    /**
     * Determine if the center can view a student document.
     */
    public function viewDocument(Center $center, StudentDocument $document): bool
    {
        // Center can only view documents belonging to their own students
        return $document->student && $document->student->center_id === $center->id;
    }

    /**
     * Determine if the center can upload a document for a student.
     */
    public function uploadDocument(Center $center, \App\Models\Student $student): bool
    {
        // Center can only upload documents for their own students
        return $student->center_id === $center->id;
    }
}
