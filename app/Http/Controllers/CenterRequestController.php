<?php

namespace App\Http\Controllers;

use App\Http\Requests\CenterStoreRequest;
use App\Models\District;
use App\Models\Division;
use App\Models\Upazila;
use Inertia\Inertia;

class CenterRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('CenterRequest/Create', [
            'divisions' => \App\Helpers\LocationHelper::getDivisions(),
            'districts' => \App\Helpers\LocationHelper::getDistrictsGroupedByDivision(),
            'upazilas' => \App\Helpers\LocationHelper::getUpazilasGroupedByDistrict(),
        ]);
    }

    public function store(CenterStoreRequest $request)
    {

        return response()->report(
            $request->store(),
            'Center request submitted successfully'
        );
    }
}
