<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionPolicy;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommissionPolicyController extends Controller
{
    public function index()
    {
        $policies = CommissionPolicy::with('team')->latest()->paginate(20);
        $teams = Team::select('id', 'name')->where('is_active', true)->get();
        
        return Inertia::render('Admin/CommissionPolicies/Index', [
            'policies' => $policies,
            'teams' => $teams
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'team_id' => 'nullable|exists:teams,id',
            'product_type' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        CommissionPolicy::create($validated);

        return redirect()->back()->with('success', 'Commission policy created successfully.');
    }

    public function update(Request $request, CommissionPolicy $commissionPolicy)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'team_id' => 'nullable|exists:teams,id',
            'product_type' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        $commissionPolicy->update($validated);

        return redirect()->back()->with('success', 'Commission policy updated successfully.');
    }

    public function destroy(CommissionPolicy $commissionPolicy)
    {
        $commissionPolicy->delete();
        return redirect()->back()->with('success', 'Commission policy deleted successfully.');
    }
}
