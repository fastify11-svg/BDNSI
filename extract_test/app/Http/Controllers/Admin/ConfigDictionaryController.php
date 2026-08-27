<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class ConfigDictionaryController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'configDictionary';

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    public function create()
    {
        return Inertia::render('Admin/ConfigDictionary/Create', [
            'settings' => SiteConfig::first(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'portal_name' => 'nullable|string|max:255',
            'hotline_phone' => 'nullable|string|max:50',
            'official_email' => 'nullable|email|max:255',
            'main_logo' => 'nullable|image|max:2048',
            'favicon' => 'nullable|image|max:1024',
            'header_logo' => 'nullable|image|max:2048',
            'footer_top_bg_image' => 'nullable|image|max:3072',
            'footer_side_bg_image' => 'nullable|image|max:3072',
        ]);

        $config = SiteConfig::updateSettings($request);

        return response()->report($config, 'Successfully Updated System Configuration');
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
        //
    }
}
