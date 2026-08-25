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
