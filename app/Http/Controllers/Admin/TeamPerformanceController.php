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

        // 1. Pre-fetch all targets for this date
        $targets = TeamSalesTarget::whereDate('target_date', $date)
            ->get()
            ->keyBy('team_id');

        // 2. Pre-fetch all students created on this date with their center
        $studentsToday = Student::with('center')
            ->whereDate('created_at', $date)
            ->get();

        // 3. Pre-fetch all certificates created on this date with their student->center
        $certificatesToday = Result::with('student.center')
            ->whereDate('created_at', $date)
            ->where('certificate', 1)
            ->get();

        $teams = Team::all()->map(function ($team) use ($targets, $studentsToday, $certificatesToday) {
            
            // Get Target for this date from the pre-fetched collection
            $target = $targets->get($team->id);

            // Calculate Actual Students using collection filtering
            $actualStudents = $studentsToday->filter(function ($student) use ($team) {
                return $student->team_id == $team->id || 
                       ($student->center && $student->center->team_id == $team->id);
            })->count();

            // Calculate Actual B2B Certificates using collection filtering
            $actualCertificates = $certificatesToday->filter(function ($result) use ($team) {
                return $result->student && 
                       $result->student->center && 
                       $result->student->center->team_id == $team->id;
            })->count();

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
