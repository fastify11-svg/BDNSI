<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::with('team')->orderBy('created_at', 'desc')->paginate(15);
        return Inertia::render('Admin/Leads/Index', [
            'leads' => $leads
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'nullable|string|max:255',
            'team_id' => 'nullable|exists:teams,id',
            'status' => 'required|in:New,Contacted,Negotiating,Converted,Lost,Follow-up',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        Lead::create($validated);
        return redirect()->back()->with('success', 'Lead created successfully.');
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'nullable|string|max:255',
            'team_id' => 'nullable|exists:teams,id',
            'status' => 'required|in:New,Contacted,Negotiating,Converted,Lost,Follow-up',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        $lead->update($validated);
        return redirect()->back()->with('success', 'Lead updated successfully.');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return redirect()->back()->with('success', 'Lead deleted successfully.');
    }
}
