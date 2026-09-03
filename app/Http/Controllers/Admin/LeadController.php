<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Center;
use App\Models\Lead;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display the leads index.
     */
    public function index()
    {
        $leads = Lead::with(['team', 'center', 'creator'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $teams = Team::orderBy('name')->get(['id', 'name']);
        $centers = Center::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Leads/Index', [
            'leads'   => $leads,
            'teams'   => $teams,
            'centers' => $centers,
            'statuses' => Lead::$statuses,
        ]);
    }

    /**
     * Show the create lead form (Inertia).
     * Using index page modal — redirect back to index.
     */
    public function create()
    {
        return redirect()->route('admin.leads.index');
    }

    /**
     * Store a new lead.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'source'         => 'nullable|string|max:255',
            'team_id'        => 'nullable|exists:teams,id',
            'center_id'      => 'nullable|exists:centers,id',
            'status'         => 'required|in:New,Contacted,Negotiating,Converted,Lost,Follow-up',
            'notes'          => 'nullable|string|max:5000',
            'follow_up_date' => 'nullable|date',
        ]);

        $validated['created_by'] = auth()->guard('admin')->id();

        $lead = Lead::create($validated);

        AuditLog::create([
            'user_id'        => auth()->guard('admin')->id(),
            'event'          => 'lead_created',
            'auditable_id'   => $lead->id,
            'auditable_type' => Lead::class,
            'new_values'     => ['name' => $lead->name, 'phone' => $lead->phone, 'status' => $lead->status],
            'ip_address'     => request()->ip(),
            'user_agent'     => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Lead created successfully.');
    }

    /**
     * Show a single lead (redirects to index for modal-based UI).
     */
    public function show(Lead $lead)
    {
        return redirect()->route('admin.leads.index');
    }

    /**
     * Show the edit form (redirects to index for modal-based UI).
     */
    public function edit(Lead $lead)
    {
        return redirect()->route('admin.leads.index');
    }

    /**
     * Update an existing lead.
     */
    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'source'         => 'nullable|string|max:255',
            'team_id'        => 'nullable|exists:teams,id',
            'center_id'      => 'nullable|exists:centers,id',
            'status'         => 'required|in:New,Contacted,Negotiating,Converted,Lost,Follow-up',
            'notes'          => 'nullable|string|max:5000',
            'follow_up_date' => 'nullable|date',
        ]);

        $oldStatus = $lead->status;
        $lead->update($validated);

        AuditLog::create([
            'user_id'        => auth()->guard('admin')->id(),
            'event'          => 'lead_updated',
            'auditable_id'   => $lead->id,
            'auditable_type' => Lead::class,
            'old_values'     => ['status' => $oldStatus],
            'new_values'     => ['name' => $lead->name, 'status' => $lead->status],
            'ip_address'     => request()->ip(),
            'user_agent'     => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Lead updated successfully.');
    }

    /**
     * Delete a lead.
     */
    public function destroy(Lead $lead)
    {
        $leadName = $lead->name;
        $leadId   = $lead->id;

        $lead->delete();

        AuditLog::create([
            'user_id'        => auth()->guard('admin')->id(),
            'event'          => 'lead_deleted',
            'auditable_id'   => $leadId,
            'auditable_type' => Lead::class,
            'old_values'     => ['name' => $leadName],
            'ip_address'     => request()->ip(),
            'user_agent'     => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Lead deleted successfully.');
    }
}
