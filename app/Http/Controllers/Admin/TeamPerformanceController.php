<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamSalesTarget;
use App\Models\Student;
use App\Models\Result;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TeamPerformanceController extends Controller
{
    public function index(Request $request, \App\Services\TeamPerformanceService $performanceService)
    {
        $date = Carbon::parse($request->input('date', Carbon::today()->toDateString()));

        $teams = $performanceService->getBulkPerformanceMetrics($date);

        return Inertia::render('Admin/TeamPerformance/Index', [
            'date' => $date->toDateString(),
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('TeamPerformance store method hit', $request->all());
        $request->validate([
            'date' => 'required|date',
            'targets' => 'required|array',
            'targets.*.team_id' => 'required|exists:teams,id',
            'targets.*.student_target' => 'required|integer|min:0',
            'targets.*.b2b_certificate_target' => 'required|integer|min:0',
        ]);

        $date = $request->input('date');
        $targets = $request->input('targets');

        foreach ($targets as $targetData) {
            TeamSalesTarget::updateOrCreate(
                [
                    'team_id' => $targetData['team_id'],
                    'target_date' => $date,
                ],
                [
                    'student_target' => $targetData['student_target'],
                    'b2b_certificate_target' => $targetData['b2b_certificate_target'],
                ]
            );
        }

        return redirect()->back()->with('success', 'Targets updated successfully.');
    }
}
