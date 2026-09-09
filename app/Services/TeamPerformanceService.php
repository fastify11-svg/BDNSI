<?php

namespace App\Services;

use App\Models\Team;
use App\Models\TeamSalesTarget;
use App\Models\Student;
use App\Models\Result;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class TeamPerformanceService
{
    /**
     * Get bulk performance metrics for all teams, completely optimized.
     */
    public function getBulkPerformanceMetrics(Carbon $date): Collection
    {
        $targets = TeamSalesTarget::whereDate('target_date', $date)->get()->keyBy('team_id');
        $studentsToday = Student::withoutGlobalScopes()->with('center')->whereDate('created_at', $date)->get();
        $certificatesToday = Result::withoutGlobalScopes()->with('student.center')->whereDate('created_at', $date)->where('certificate', 1)->get();

        return Team::all()->map(function ($team) use ($targets, $studentsToday, $certificatesToday) {
            return $this->calculateForTeam($team, $targets, $studentsToday, $certificatesToday);
        });
    }

    /**
     * Get performance metrics for a single team.
     */
    public function getTeamPerformanceMetrics(Team $team, Carbon $date): array
    {
        // For a single team, use DB queries without global scopes to bypass restricted auth scopes
        $target = TeamSalesTarget::where('team_id', $team->id)->whereDate('target_date', $date)->first();

        $actualStudents = Student::withoutGlobalScopes()
            ->whereDate('created_at', $date)
            ->where(function ($query) use ($team) {
                $query->where('team_id', $team->id)
                      ->orWhereHas('center', function ($q) use ($team) {
                          $q->withoutGlobalScopes()->where('team_id', $team->id);
                      });
            })
            ->count();

        $actualCertificates = Result::withoutGlobalScopes()
            ->whereDate('created_at', $date)
            ->where('certificate', 1)
            ->whereHas('student.center', function ($q) use ($team) {
                $q->withoutGlobalScopes()->where('team_id', $team->id);
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
    }

    private function calculateForTeam(Team $team, Collection $targets, Collection $studentsToday, Collection $certificatesToday): array
    {
        $target = $targets->get($team->id);

        $actualStudents = $studentsToday->filter(function ($student) use ($team) {
            return $student->team_id == $team->id || 
                   ($student->center && $student->center->team_id == $team->id);
        })->count();

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
    }
}
