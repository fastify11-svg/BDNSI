<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubadminController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'sub-admin';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Admin::query())->toJson();
        }
        $subAdmins = Admin::latest()->paginate(25);

        return Inertia::render('Admin/Subadmin/Index', compact('subAdmins'));
    }

    public function create()
    {
        return view('admin.subAdmin.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:admins',
            'password' => 'required|confirmed',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $subadmin = Admin::create($validated);
        $subadmin->attachRole('sub_admin');

        return response()->report($subadmin, 'SubAdmin created successfully');
    }

    public function show(Admin $subAdmin)
    {
        return view('admin.subAdmin.show', compact('subAdmin'));
    }

    public function edit(Admin $sub_admin)
    {
        return view('admin.subAdmin.edit', [
            'user' => $sub_admin,

        ]);
    }

    public function update(Request $request, Admin $sub_admin)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique('admins')->ignore($sub_admin->id)],
            'password' => 'nullable|confirmed',
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        return response()->report(
            $sub_admin->update($validated),
            'Admin updated successfully'
        );
    }

    public function destroy(Admin $sub_admin)
    {
        return response()->report($sub_admin->delete(), 'Admin deleted successfully');
    }
}
