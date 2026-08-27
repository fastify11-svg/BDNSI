<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SliderType;
use App\Http\Controllers\Controller;
use App\Lib\Image;
use App\Models\Slider;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SliderController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'slider';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Slider::whereIn('type', [SliderType::Slider, SliderType::Gallery])->select(['id', 'title', 'subtitle', 'photo', 'type', 'status', 'order_index']))->addIndexColumn()->toJson();
        }

        $sliders = Slider::whereIn('type', [SliderType::Slider, SliderType::Gallery])
            ->orderBy('order_index', 'asc')
            ->latest()
            ->paginate(25);

        return Inertia::render('Admin/Slider/Index', compact('sliders'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
            'status' => 'nullable|boolean',
            'order_index' => 'nullable|integer',
            'photo' => 'required|image',
            'type' => 'required',
        ]);

        $validated['photo'] = Image::storeFile($request->file('photo'), 'slider');
        $validated['status'] = $request->has('status') ? $request->status : 1;
        $validated['order_index'] = $request->order_index ?? 0;
        $validated['type'] = (int) $request->type;

        $slider = Slider::create($validated);

        return redirect()->back()->with('success', 'Slider Created successfully');
    }

    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
            'status' => 'nullable|boolean',
            'order_index' => 'nullable|integer',
            'photo' => 'nullable|image',
            'type' => 'required',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = Image::storeFile($request->file('photo'), 'slider');
        }

        $validated['status'] = $request->has('status') ? $request->status : 1;
        $validated['order_index'] = $request->order_index ?? 0;
        $validated['type'] = (int) $request->type;

        $slider->update($validated);

        return redirect()->back()->with('success', 'Slider Updated successfully');
    }

    public function destroy(Slider $slider)
    {
        $slider->delete();

        return redirect()->back()->with('success', 'Slider Deleted successfully');
    }
}
