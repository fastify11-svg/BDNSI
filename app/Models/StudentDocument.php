<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'document_type_id',
        'file_path',
        'status',
        'rejected_reason',
        'ai_confidence_score',
        'ai_classification',
        'ai_mismatch_detected',
        'ai_mismatch_details',
        'ai_extracted_data',
        'ai_analyzed_at',
    ];

    protected $casts = [
        'ai_mismatch_detected' => 'boolean',
        'ai_extracted_data' => 'array',
        'ai_analyzed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }
}
