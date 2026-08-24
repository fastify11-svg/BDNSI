<?php

namespace App\Http\Controllers;

use App\Enums\StudentStatus;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $auth = Auth::user();
        $centerId = $auth->center_id;
        $center = $auth->center; // Load center relationships

        $cards = [
            'Total Student' => Student::hide()->where('center_id', $centerId)->count(),
            'Total Approved' => Student::hide()->where('center_id', $centerId)->where('status', StudentStatus::Approved)->count(),
            'Total Pending' => Student::hide()->where('center_id', $centerId)->whereIn('status', [StudentStatus::Pending, StudentStatus::Requested])->count(),
        ];

        $financials = null;
        if ($center) {
            $financials = [
                'credit_enabled' => $center->credit_enabled,
                'credit_limit' => $center->credit_limit,
                'current_due' => $center->current_due,
                'available_credit' => $center->available_credit,
            ];
        }

        return Inertia::render('Center/Dashboard', compact('cards', 'financials'));
    }
}
