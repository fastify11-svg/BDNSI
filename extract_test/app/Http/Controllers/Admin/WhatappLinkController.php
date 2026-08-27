<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhatappLink;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class WhatappLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(WhatappLink::get())->addIndexColumn()->toJson();
        }
        $whatsappLinks = WhatappLink::latest()->paginate(25);

        return Inertia::render('Admin/WhatappLink/Index', compact('whatsappLinks'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required|unique:whatapp_links,phone',
            'description' => 'required',
        ]);
        WhatappLink::create($validated);

        return response()->success('Successfully Created');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $data = WhatappLink::findOrFail($id);
        $data->delete();

        return response()->success('Successfully Deleted');
    }
}
