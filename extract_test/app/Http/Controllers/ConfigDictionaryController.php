<?php

namespace App\Http\Controllers;

use App\Lib\Image;
use App\Models\ConfigDictionary;
use App\Models\SiteConfig;
use Illuminate\Http\Request;

class ConfigDictionaryController extends Controller
{
    public function store(Request $request)
    {
        $config = SiteConfig::first() ?? new SiteConfig;

        $data = $request->except(['header_logo', 'main_logo', 'favicon']);

        if ($request->hasFile('header_logo')) {
            $data['header_logo'] = Image::storeFile($request->file('header_logo'), 'logos');
        }

        if ($request->hasFile('main_logo')) {
            $data['main_logo'] = Image::storeFile($request->file('main_logo'), 'logos');
        }

        if ($request->hasFile('favicon')) {
            $data['favicon'] = Image::storeFile($request->file('favicon'), 'logos');
        }

        $config->fill($data);
        $config->save();

        // BUG FIX: Sync all data to ConfigDictionary so the Frontend gets the updates instantly
        $allConfigData = $config->toArray();
        unset($allConfigData['id'], $allConfigData['created_at'], $allConfigData['updated_at']);
        ConfigDictionary::setMany($allConfigData);

        return redirect()->back()->with('success', 'Site configuration updated successfully.');
    }
}
