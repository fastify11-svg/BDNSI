<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConfigDictionary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApiSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $apiSettings = ConfigDictionary::get('api_settings', []);

        return Inertia::render('Admin/ApiSetting/Index', [
            'api_settings' => $apiSettings,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'gemini_api_key' => 'nullable|string',
        ]);

        ConfigDictionary::set('api_settings', $data);

        return redirect()->back()->with('success', 'API Settings updated successfully.');
    }
}
