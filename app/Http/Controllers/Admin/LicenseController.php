<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\License;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LicenseController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'license';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(License::select(['id', 'cnic', 'name', 'license_number', 'allowed_vehicles', 'valid_to']))
                ->addIndexColumn()

                ->addColumn('valid_to_formatted', function ($license) {
                    return $license->valid_to ? $license->valid_to->format('Y-m-d') : 'N/A';
                })
                ->toJson();
        }

        $licenses = License::latest()->paginate(25);

        return Inertia::render('Admin/License/Index', compact('licenses'));
    }

    public function create()
    {
        return view('admin.license.create', [
            'vehicleOptions' => ['M', 'CYCLE', 'CAR', 'JEEP'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cnic' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'license_number' => 'required|string|max:255|unique:licenses,license_number',
            'issue_date' => 'required|date',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after:valid_from',
            'credential_type' => 'required|array|min:1',
            'credential_type.*' => 'required|string|in:M,CYCLE,CAR,JEEP',
        ]);

        $license = License::create($validated);

        return response()->report($license, 'License created successfully');
    }

    public function show(License $license)
    {
        return view('admin.license.show', compact('license'));
    }

    public function edit(License $license)
    {
        return view('admin.license.edit', [
            'license' => $license,
            'vehicleOptions' => ['M', 'CYCLE', 'CAR', 'JEEP'],
        ]);
    }

    public function update(Request $request, License $license)
    {
        $validated = $request->validate([
            'cnic' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'license_number' => 'required|string|max:255|unique:licenses,license_number,'.$license->id,
            'issue_date' => 'required|date',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after:valid_from',
            'allowed_vehicles' => 'required|array|min:1',
            'allowed_vehicles.*' => 'required|string|in:M,CYCLE,CAR,JEEP',
        ]);

        $license->update($validated);

        return response()->report($license, 'License updated successfully');
    }

    public function destroy(License $license)
    {
        $license->delete();

        return response()->report($license, 'License deleted successfully');
    }
}
