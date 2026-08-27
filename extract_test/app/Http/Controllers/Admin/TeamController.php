<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Lib\Image;
use App\Models\Team;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'team';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Team::orderBy('order_index', 'asc')->orderBy('id', 'desc')->get())->addIndexColumn()->toJson();
        }

        $teams = Team::orderBy('order_index', 'asc')->latest()->paginate(25);

        return Inertia::render('Admin/Team/Index', compact('teams'));
    }

    public function create(Request $request)
    {
        return view('admin.team.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'designation' => 'required',
            'image' => 'nullable', // made nullable since frontend will upload photo, wait let me check the model, it uses ImageField trait, so it should be file
            'description' => 'nullable',

            // translations optional
            'bn_name' => 'nullable',
            'ar_name' => 'nullable',
            'bn_designation' => 'nullable',
            'ar_designation' => 'nullable',
            'bn_description' => 'nullable',
            'ar_description' => 'nullable',

            // advanced fields
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'facebook_link' => 'nullable|string',
            'twitter_link' => 'nullable|string',
            'linkedin_link' => 'nullable|string',
            'order_index' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $validated['image'] = Image::storeFile($request->file('photo'), 'team');
        } elseif ($request->hasFile('image')) {
            $validated['image'] = Image::storeFile($request->file('image'), 'team');
        }

        $validated['status'] = $request->has('status') ? $request->status : 1;
        $validated['order_index'] = $request->order_index ?? 0;

        Team::create($validated);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Team Member Created successfully');
        }

        return response()->success('Succesfully Created');
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $data = Team::findOrFail($id);

        return view('admin.team.edit', compact('data'));
    }

    public function update(Request $request, $id)
    {
        $data = Team::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required',
            'designation' => 'required',
            'image' => 'nullable',
            'description' => 'nullable',

            // translations optional
            'bn_name' => 'nullable',
            'ar_name' => 'nullable',
            'bn_designation' => 'nullable',
            'ar_designation' => 'nullable',
            'bn_description' => 'nullable',
            'ar_description' => 'nullable',

            // advanced fields
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'facebook_link' => 'nullable|string',
            'twitter_link' => 'nullable|string',
            'linkedin_link' => 'nullable|string',
            'order_index' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $validated['image'] = Image::storeFile($request->file('photo'), 'team');
        } elseif ($request->hasFile('image')) {
            $validated['image'] = Image::storeFile($request->file('image'), 'team');
        }

        $validated['status'] = $request->has('status') ? $request->status : 1;
        $validated['order_index'] = $request->order_index ?? 0;

        $data->update($validated);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Team Member Updated successfully');
        }

        return response()->success('Succesfully Updated');
    }

    public function destroy($id, Request $request)
    {
        $team = Team::findOrFail($id);
        $team->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Team Member Deleted successfully');
        }

        return response()->success('Successfully Deleted');
    }
}
