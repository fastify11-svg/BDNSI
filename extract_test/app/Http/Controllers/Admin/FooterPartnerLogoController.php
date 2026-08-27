<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Lib\Image;
use App\Models\FooterPartnerLogo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterPartnerLogoController extends Controller
{
    public function index()
    {
        $logos = FooterPartnerLogo::orderBy('sort_order', 'asc')->get();

        return Inertia::render('Admin/Footer/Logos', [
            'logos' => $logos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:2048',
            'url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $imagePath = Image::store('image', 'footer_logos');

        FooterPartnerLogo::create([
            'title' => $request->title,
            'image_path' => $imagePath,
            'url' => $request->url,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->has('is_active') ? $request->is_active : 1,
        ]);

        return redirect()->back()->with('success', 'Partner logo added successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $logo = FooterPartnerLogo::findOrFail($id);

        $data = [
            'title' => $request->title,
            'url' => $request->url,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->has('is_active') ? $request->is_active : 1,
        ];

        if ($request->hasFile('image')) {
            $data['image_path'] = Image::store('image', 'footer_logos');
        }

        $logo->update($data);

        return redirect()->back()->with('success', 'Partner logo updated successfully.');
    }

    public function destroy($id)
    {
        $logo = FooterPartnerLogo::findOrFail($id);
        $logo->delete();

        return redirect()->back()->with('success', 'Partner logo deleted successfully.');
    }
}
