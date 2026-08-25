<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\DocumentType;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\User;
use App\Models\Admin;
use App\Services\DocumentVerificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PhaseGDocumentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create basic structure
        $role = \App\Models\Role::firstOrCreate(['name' => 'admin']);
        $this->admin = Admin::factory()->create();
        dump(get_class($this->admin));
        $this->admin->attachRole($role);
        
        $this->centerA = Center::factory()->create(['id' => 1, 'name' => 'Center A', 'code' => 'C-001']);
        $this->centerUserA = User::factory()->create(['center_id' => $this->centerA->id, 'username' => 'center_a_test', 'phone' => '01711111111']);

        $this->centerB = Center::factory()->create(['id' => 2, 'name' => 'Center B', 'code' => 'C-002']);
        $this->centerUserB = User::factory()->create(['center_id' => $this->centerB->id, 'username' => 'center_b_test', 'phone' => '01711111112']);

        $sessionId = \Illuminate\Support\Facades\DB::table('sessions')->insertGetId(['name' => '2026']);
        $subjectId = \Illuminate\Support\Facades\DB::table('subjects')->insertGetId(['name' => 'Math']);

        $this->studentA = Student::factory()->create([
            'center_id' => $this->centerA->id, 
            'registration' => '111111', 
            'session_id' => $sessionId, 
            'subject_id' => $subjectId
        ]);
        $this->studentB = Student::factory()->create([
            'center_id' => $this->centerB->id, 
            'registration' => '222222',
            'session_id' => $sessionId, 
            'subject_id' => $subjectId
        ]);

        $this->docType = DocumentType::create(['name' => 'NID', 'is_required' => true]);
    }

    public function test_document_type_can_be_created()
    {
        $this->assertDatabaseHas('document_types', ['name' => 'NID', 'is_required' => 1]);
    }

    public function test_admin_can_review_and_approve_document()
    {
        Storage::fake('local');
        
        $doc = StudentDocument::create([
            'student_id' => $this->studentA->id,
            'document_type_id' => $this->docType->id,
            'file_path' => 'private/docs/test.jpg',
            'status' => 'Pending'
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.student-documents.approve', $doc->id));

        $response->assertRedirect();
        $this->assertDatabaseHas('student_documents', [
            'id' => $doc->id,
            'status' => 'Approved'
        ]);
    }

    public function test_admin_can_reject_document()
    {
        Storage::fake('local');
        
        $doc = StudentDocument::create([
            'student_id' => $this->studentA->id,
            'document_type_id' => $this->docType->id,
            'file_path' => 'private/docs/test.jpg',
            'status' => 'Pending'
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.student-documents.reject', $doc->id), [
                'reason' => 'Blurry image'
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('student_documents', [
            'id' => $doc->id,
            'status' => 'Rejected',
            'rejected_reason' => 'Blurry image'
        ]);
    }

    public function test_document_idor_protection()
    {
        Storage::fake('local');
        Storage::disk('local')->put('private/docs/secret.jpg', 'fake-content');
        
        $docA = StudentDocument::create([
            'student_id' => $this->studentA->id,
            'document_type_id' => $this->docType->id,
            'file_path' => 'private/docs/secret.jpg',
            'status' => 'Pending'
        ]);

        // A Center cannot view the document via the Admin endpoint
        $response = $this->actingAs($this->centerUserA)
            ->get(route('admin.student-documents.view', $docA->id));
            
        // Should redirect to login or throw 403 due to admin auth middleware
        $this->assertTrue(in_array($response->status(), [302, 403, 401]));
    }
}
