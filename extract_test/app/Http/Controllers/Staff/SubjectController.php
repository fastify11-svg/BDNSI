<?php

namespace App\Http\Controllers\Staff;

use App\Enums\CourseType;
use App\Http\Controllers\Controller;
use App\Lib\Image;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::withCount('students')->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $subjects = $query->paginate(15)->withQueryString();

        return Inertia::render('Staff/Subject/Index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'duration' => 'nullable|string|max:100',
            'rate' => 'required|numeric|min:0',
            'education_qualification' => 'nullable|string|max:255',
            'course_details' => 'nullable|string',
            'type' => 'nullable',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = Image::store('photo', 'subject');
        }

        $validated['type'] = $request->type ?? CourseType::Regular;

        Subject::create($validated);

        return redirect()->back()->with('success', 'Custom course created successfully.');
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'duration' => 'nullable|string|max:100',
            'rate' => 'required|numeric|min:0',
            'education_qualification' => 'nullable|string|max:255',
            'course_details' => 'nullable|string',
            'type' => 'nullable',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = Image::store('photo', 'subject');
        }

        $subject->update($validated);

        return redirect()->back()->with('success', 'Custom course updated successfully.');
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->back()->with('success', 'Course removed successfully.');
    }
}
