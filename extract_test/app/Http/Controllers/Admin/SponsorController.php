<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SliderType;
use App\Http\Controllers\Controller;
use App\Lib\Image;
use App\Models\Slider;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class SponsorController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'sponsor';

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Slider::where('type', SliderType::Sponsor))->addIndexColumn()->toJson();
        }
        $sponsors = Slider::where('type', SliderType::Sponsor)->latest()->paginate(25);

        return Inertia::render('Admin/Sponsor/Index', compact('sponsors'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.sponsor.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'photo' => 'required|image',
        ]);

        $validated['type'] = SliderType::Sponsor;
        $validated['photo'] = Image::store('photo', 'upload/slider');

        $sponsor = Slider::create($validated);

        return response()->report($sponsor, 'Sponsor Created successfully');
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        $sponsor = Slider::findOrFail($id);
        $sponsor->delete();

        return response()->report($sponsor, 'Sponsor Deleted successfully');
    }
}
