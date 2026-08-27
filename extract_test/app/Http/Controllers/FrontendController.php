<?php

namespace App\Http\Controllers;

use App\Enums\CenterStatus;
use App\Enums\StudentStatus;
use App\Models\Center;
use App\Models\District;
use App\Models\Division;
use App\Models\Student;
use App\Models\Upazila;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function verifyInstitute(Request $request)
    {

        $centers = Center::when($request->district && $request->upazilla, function ($query) use ($request) {
            return $query->where(['district' => $request->district, 'upazilla' => $request->upazilla]);
        })->withCount('students')->where('status', CenterStatus::Approved)->paginate(12);

        return view('page.verifyInstitute',
            [
                'centers' => $centers,
                'divisions' => Division::get(),
                'districts' => District::get()->mapWithKeys(function ($district) {
                    return [
                        $district->id => [
                            'division_id' => $district->division_id,
                            'name' => $district->name,
                        ],
                    ];
                }),
                'upazilas' => Upazila::get()->mapWithKeys(function ($upazila) {
                    return [
                        $upazila->id => [
                            'district_id' => $upazila->district_id,
                            'name' => $upazila->name,
                        ],
                    ];
                })->toArray()]
        );
    }

    public function successStudent(Request $request)
    {
        $students = Student::hide()->whereHas('result')->select('id', 'name', 'picture')->where('status', StudentStatus::Approved)->paginate(40);

        return view('page.successStudent', compact('students'));
    }

    public function successStudentDetails($id)
    {
        $data = Student::hide()->with(['center', 'subject', 'session'])->whereHas('result')->where('status', StudentStatus::Approved)->findOrFail($id);

        return view('page.successStudentDetails', compact('data'));
    }

    public function studentInfo($id)
    {
        $data = Student::hide()->with(['center', 'subject', 'session'])->where('status', StudentStatus::Approved)->findOrFail($id);

        return view('page.studentInfo', compact('data'));
    }
}
