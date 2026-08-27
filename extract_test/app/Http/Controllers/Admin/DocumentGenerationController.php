<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use App\Models\Student;
use App\Services\DocumentGeneratorService;
use Illuminate\Http\Request;

class DocumentGenerationController extends Controller
{
    protected $generatorService;

    public function __construct(DocumentGeneratorService $generatorService)
    {
        $this->generatorService = $generatorService;
    }

    public function generate($template_id, $student_id)
    {
        $template = DocumentTemplate::with('fields')->findOrFail($template_id);
        $student = Student::findOrFail($student_id);

        $mappedFields = $this->generatorService->generateForStudent($template, $student);

        // Check if template uses the 8-page semester table
        $has8PageTable = collect($mappedFields)->contains(function($item) {
            $key = $item['field']->variable_key ?? '';
            return $key === 'semester_table_8_page';
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

    /**
     * Generate documents for multiple students at once.
     */
    public function bulkGenerate(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:document_templates,id',
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $template = DocumentTemplate::with('fields')->findOrFail($request->template_id);
        $students = Student::with(['center', 'session', 'subject'])->whereIn('id', $request->student_ids)->get();

        // Check if template uses the 8-page semester table
        $has8PageTable = $template->fields->contains('variable_key', 'semester_table_8_page');

        $documents = [];

        foreach ($students as $student) {
            $pages = [];
            $mappedFields = $this->generatorService->generateForStudent($template, $student);

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

            $documents[] = [
                'student' => $student,
                'pages' => $pages,
            ];
        }

        return view('admin.document_template.bulk_preview', compact('template', 'documents'));
    }
}
