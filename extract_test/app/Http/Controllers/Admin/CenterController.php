<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CenterStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CenterStoreRequest;
use App\Http\Requests\CenterUpdateRequest;
use App\Models\Center;
use App\Models\District;
use App\Models\Division;
use App\Models\Result;
use App\Models\Student;
use App\Models\Upazila;
use App\Models\User;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CenterController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'center';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Center::orderBy('id', 'desc')->get())->addIndexColumn()->toJson();
        }

        $query = Center::withCount('allStudents')->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('owner_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $statusVal = strtolower($request->input('status'));
            if ($statusVal === 'pending' || $statusVal === '0') {
                $query->where('status', CenterStatus::Pending);
            } elseif ($statusVal === 'approved' || $statusVal === '1') {
                $query->where('status', CenterStatus::Approved);
            } elseif ($statusVal === 'suspended' || $statusVal === '2') {
                $query->where('status', CenterStatus::Suspended);
            }
        }

        $centers = $query->paginate(20)->withQueryString();

        $filters = [
            'search' => $request->input('search', ''),
            'status' => $request->input('status', 'all'),
        ];

        return Inertia::render('Admin/Center/Index', [
            'centers' => $centers,
            'filters' => $filters,
        ]);
    }

    public function updateStatus(Request $request, Center $center)
    {
        $validated = $request->validate([
            'status' => 'required|integer|in:0,1,2',
        ]);

        $statusVal = (int) $validated['status'];

        if ($statusVal === 1 || $statusVal === CenterStatus::Approved->value) {
            $rawCode = $center->getRawOriginal('code');
            if (empty($rawCode)) {
                $maxCode = DB::table('centers')
                    ->whereNotNull('code')
                    ->whereRaw("code REGEXP '^[0-9]+$'")
                    ->max(DB::raw('CAST(code AS UNSIGNED)'));

                $newCode = ($maxCode && $maxCode >= 100000) ? ($maxCode + 1) : 178173;

                while (DB::table('centers')->where('code', (string) $newCode)->exists()) {
                    $newCode++;
                }

                $center->code = (string) $newCode;
            }

            $center->status = CenterStatus::Approved;
            $center->save();

            $user = User::where('center_id', $center->id)->first();
            if (! $user) {
                $defaultPassword = 'password123';
                User::create([
                    'username' => $center->code,
                    'name' => $center->name,
                    'email' => $center->email,
                    'phone' => $center->mobile ?? '01711000000',
                    'center_id' => $center->id,
                    'password' => Hash::make($defaultPassword),
                ]);
            }
        } else {
            $center->status = $statusVal;
            $center->save();
        }

        return redirect()->back()->with('success', 'Center status updated successfully!');
    }

    public function create(Request $request)
    {
        $divisions = Division::get();
        $districts = District::get()->mapWithKeys(function ($district) {
            return [
                $district->id => [
                    'division_id' => $district->division_id,
                    'name' => $district->name,
                ],
            ];
        });
        $upazilas = Upazila::get()->mapWithKeys(function ($upazila) {
            return [
                $upazila->id => [
                    'district_id' => $upazila->district_id,
                    'name' => $upazila->name,
                ],
            ];
        })->toArray();

        $teams = \App\Models\Team::all();
        if ($request->header('X-Inertia') || ! $request->ajax()) {
            return Inertia::render('Admin/Center/Create', [
                'divisions' => $divisions,
                'districts' => $districts,
                'upazilas' => $upazilas,
                'teams' => $teams,
            ]);
        }

        return view('admin.center.create', compact('divisions', 'districts', 'upazilas'));
    }

    public function store(CenterStoreRequest $request)
    {
        $center = $request->store(CenterStatus::Approved);
        if ($request->header('X-Inertia')) {
            return redirect()->route('admin.center.index')->with('success', 'Center Created successfully');
        }

        return response()->report($center, 'Center Created successfully');
    }

    public function show(Request $request, Center $center)
    {
        $user = User::where('center_id', $center->id)->first();
        if ($request->header('X-Inertia') || ! $request->ajax()) {
            return Inertia::render('Admin/Center/Show', [
                'center' => $center,
                'user' => $user,
            ]);
        }

        return view('admin.center.show', [
            'center' => $center,
            'user' => $user,
        ]);
    }

    public function edit(Request $request, Center $center)
    {
        $divisions = Division::get();
        $districts = District::get()->mapWithKeys(function ($district) {
            return [
                $district->id => [
                    'division_id' => $district->division_id,
                    'name' => $district->name,
                ],
            ];
        });
        $upazilas = Upazila::get()->mapWithKeys(function ($upazila) {
            return [
                $upazila->id => [
                    'district_id' => $upazila->district_id,
                    'name' => $upazila->name,
                ],
            ];
        })->toArray();

        $teams = \App\Models\Team::all();
        if ($request->header('X-Inertia') || ! $request->ajax()) {
            return Inertia::render('Admin/Center/Edit', [
                'center' => $center,
                'divisions' => $divisions,
                'districts' => $districts,
                'upazilas' => $upazilas,
                'teams' => $teams,
            ]);
        }

        return view('admin.center.edit', compact('center', 'divisions', 'districts', 'upazilas'));
    }

    public function update(CenterUpdateRequest $request, Center $center)
    {
        DB::transaction(function () use ($request, $center) {
            $request->update($center);
        });

        if ($request->header('X-Inertia')) {
            return redirect()->route('admin.center.index')->with('success', 'Center updated successfully');
        }

        return response()->report($center, 'Center updated successfully');
    }

    public function destroy(Center $center)
    {
        try {
            DB::beginTransaction();
            User::where('center_id', $center->id)->delete();
            $student = Student::where('center_id', $center->id)->pluck('id');
            Result::whereIn('student_id', $student)->delete();
            Student::where('center_id', $center->id)->delete();
            $center->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Center deleted successfully!');
        } catch (\Exception $exception) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Failed to delete center: '.$exception->getMessage());
        }
    }
}
