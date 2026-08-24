<?php

namespace App\Http\Controllers\Staff;

use App\Enums\SessionStatus;
use App\Http\Controllers\Controller;
use App\Models\Session;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $query = Session::latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $sessions = $query->paginate(15)->withQueryString();

        return Inertia::render('Staff/Session/Index', [
            'sessions' => $sessions,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|integer|min:1',
            'exam_date' => 'nullable|date',
            'result_published_date' => 'nullable|date',
            'status' => 'nullable',
        ]);

        $validated['status'] = $request->status ?? SessionStatus::Active;

        Session::create($validated);

        return redirect()->back()->with('success', 'Custom session term created successfully.');
    }

    public function update(Request $request, $id)
    {
        $session = Session::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|integer|min:1',
            'exam_date' => 'nullable|date',
            'result_published_date' => 'nullable|date',
            'status' => 'nullable',
        ]);

        $session->update($validated);

        return redirect()->back()->with('success', 'Session term updated successfully.');
    }

    public function destroy($id)
    {
        $session = Session::findOrFail($id);
        $session->delete();

        return redirect()->back()->with('success', 'Session term removed successfully.');
    }
}
