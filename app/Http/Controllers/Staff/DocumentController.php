<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use App\Models\Student;
use App\Services\DocumentGeneratorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    protected $generatorService;

    public function __construct(DocumentGeneratorService $generatorService)
    {
        $this->generatorService = $generatorService;
    }

    public function index(Request $request)
    {
        // Admin-designed document templates
        $templates = DocumentTemplate::withCount('fields')->get();

        // Staff's admitted students
        $students = Student::with(['subject', 'session', 'result'])
            ->latest()
            ->paginate(25);

        return Inertia::render('Staff/Document/Index', [
            'templates' => $templates,
            'students' => $students,
        ]);
    }

    public function generate($template_id, $student_id)
    {
        $template = DocumentTemplate::with('fields')->findOrFail($template_id);
        
        // StaffScope automatically ensures student belongs to this staff
        $student = Student::findOrFail($student_id);

        $mappedFields = $this->generatorService->generateForStudent($template, $student);

        // Check if template uses 8-page semester table
        $has8PageTable = collect($mappedFields)->contains(function ($item) {
            return ($item['field']->variable_key ?? '') === 'semester_table_8_page';
        });

        $pages = [];
        if ($has8PageTable) {
            $student->loadMissing('semesterResults');
            $semesters = $student->semesterResults;
            if ($semesters && $semesters->count() > 0) {
                foreach ($semesters as $index => $sem) {
                    $pages[] = $this->generatorService->generateForStudent($template, $student, $index);
                }
            } else {
                $pages[] = $mappedFields;
            }
        } else {
            $pages[] = $mappedFields;
        }

        return view('admin.document_template.preview', compact('template', 'pages', 'student'));
    }
}
