<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'translation';

    public function index(Request $request)
    {

        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Translation::query())->addIndexColumn()->toJson();
        }

        return view('admin.translate.index');
    }

    public function create()
    {
        return view('admin.translate.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|unique:translations,key',
            'en' => 'nullable|string',
            'bn' => 'nullable|string',
            'ar' => 'nullable|string',
        ]);

        Translation::create($validated);

        return response()->success('Translation added successfully.');
    }

    public function edit($id)
    {
        $data = Translation::findOrFail($id);

        return view('admin.translate.edit', compact('data'));
    }

    public function update(Request $request, $id)
    {
        $data = Translation::findOrFail($id);
        $validated = $request->validate([
            'en' => 'nullable|string',
            'bn' => 'nullable|string',
            'ar' => 'nullable|string',
        ]);

        $data->update($validated);

        return response()->success('Translation updated successfully.');
    }

    public function destroy($id)
    {
        $data = Translation::findOrFail($id);
        $data->delete();

        return response()->success('Translation deleted successfully.');
    }
}
