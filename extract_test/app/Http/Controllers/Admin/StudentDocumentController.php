<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentDocument;
use App\Services\DocumentVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentDocumentController extends Controller
{
    protected $verificationService;

    public function __construct(DocumentVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    public function index()
    {
        // View pending documents
        $documents = StudentDocument::with(['student.center', 'documentType'])
            ->where('status', 'Pending')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents
        ]);
    }

    public function approve(StudentDocument $document)
    {
        $this->verificationService->approveDocument($document);
        return redirect()->back()->with('success', 'Document approved.');
    }

    public function reject(Request $request, StudentDocument $document)
    {
        $request->validate(['reason' => 'required|string|max:500']);
        $this->verificationService->rejectDocument($document, $request->reason);
        return redirect()->back()->with('success', 'Document rejected.');
    }

    public function view(StudentDocument $document)
    {
        // Enforced securely using Storage
        if (!Storage::exists($document->file_path)) {
            abort(404, 'File not found.');
        }

        return response()->file(storage_path('app/' . $document->file_path));
    }
}
