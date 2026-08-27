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
    public function index(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());

        $teams = Team::all()->map(function ($team) use ($date) {
            // Get Target for this date
            $target = TeamSalesTarget::where('team_id', $team->id)
                ->whereDate('target_date', $date)
                ->first();

            // Calculate Actual Students
            // Direct students (team_id on student) OR students from their centers
            $actualStudents = Student::whereDate('created_at', $date)
                ->where(function ($query) use ($team) {
                    $query->where('team_id', $team->id)
                          ->orWhereHas('center', function ($q) use ($team) {
                              $q->where('team_id', $team->id);
                          });
                })
                ->count();

            // Calculate Actual B2B Certificates (Results created today)
            $actualCertificates = Result::whereDate('created_at', $date)
                ->where('certificate', 1)
                ->whereHas('student.center', function ($q) use ($team) {
                    $q->where('team_id', $team->id);
                })
                ->count();

            return [
                'id' => $team->id,
                'name' => $team->name,
                'designation' => $team->designation,
                'target' => $target ? [
                    'student_target' => $target->student_target,
                    'b2b_certificate_target' => $target->b2b_certificate_target,
                ] : null,
                'achieved' => [
                    'students' => $actualStudents,
                    'b2b_certificates' => $actualCertificates,
                ]
            ];
        });

        return Inertia::render('Admin/TeamPerformance/Index', [
            'date' => $date,
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
