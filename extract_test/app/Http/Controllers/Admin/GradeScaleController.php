<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GradeScale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeScaleController extends Controller
{
    public function index()
    {
        $scales = GradeScale::all();
        
        // Ensure default structures exist if table is empty
        if ($scales->isEmpty()) {
            GradeScale::create(['course_type' => 0, 'max_marks' => 100, 'rules' => []]);
            GradeScale::create(['course_type' => 1, 'max_marks' => 1200, 'rules' => []]);
            GradeScale::create(['course_type' => 2, 'max_marks' => 4800, 'rules' => []]);
            $scales = GradeScale::all();
        }

        return Inertia::render('Admin/GradeScale/Index', [
            'scales' => $scales
        ]);
    }

    public function update(Request $request, GradeScale $gradeScale)
    {
        $request->validate([
            'max_marks' => 'required|integer|min:1',
            'rules' => 'nullable|array',
            'rules.*.min_percent' => 'required|numeric|min:0|max:100',
            'rules.*.max_percent' => 'required|numeric|min:0|max:100',
            'rules.*.grade_name' => 'required|string|max:50',
        ]);

        $gradeScale->update([
            'max_marks' => $request->max_marks,
            'rules' => $request->rules
        ]);

        \Illuminate\Support\Facades\Cache::forget("grade_scale_{$gradeScale->course_type}");

        return back()->with('success', 'Grading rules updated successfully.');
    }
}
