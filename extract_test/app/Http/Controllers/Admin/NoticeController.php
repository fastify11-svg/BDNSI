<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticeController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'notice';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Notice::query())->addIndexColumn()->toJson();
        }

        $query = Notice::latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('details', 'like', "%{$search}%")
                    ->orWhere('bn_details', 'like', "%{$search}%")
                    ->orWhere('ar_details', 'like', "%{$search}%");
            });
        }

        $notices = $query->paginate(20)->withQueryString();

        // Map formatted date
        $notices->getCollection()->transform(function ($notice) {
            $notice->formatted_date = $notice->created_at ? $notice->created_at->format('d M Y') : 'N/A';

            return $notice;
        });

        $filters = [
            'search' => $request->input('search', ''),
        ];

        return Inertia::render('Admin/Notice/Index', [
            'notices' => $notices,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Notice/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'details' => 'nullable|string',
            'bn_details' => 'nullable|string',
            'ar_details' => 'nullable|string',
            'image' => 'nullable',
            'file_path' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $details = $validated['details'] ?? $validated['title'] ?? 'General Notice';

        $notice = Notice::create([
            'title' => $validated['title'] ?? null,
            'details' => $details,
            'bn_details' => $validated['bn_details'] ?? $details,
            'ar_details' => $validated['ar_details'] ?? $details,
            'image' => $validated['image'] ?? null,
        ]);

        if ($request->hasFile('file_path')) {
            $path = \App\Lib\Image::storeFile($request->file('file_path'), 'notices_files');
            $notice->update(['file_path' => $path]);
        }

        return redirect()->route('notice.index')->with('success', 'Notice published successfully!');
    }

    public function edit(Notice $notice)
    {
        return Inertia::render('Admin/Notice/Edit', [
            'notice' => $notice,
        ]);
    }

    public function update(Request $request, Notice $notice)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'details' => 'nullable|string',
            'bn_details' => 'nullable|string',
            'ar_details' => 'nullable|string',
            'image' => 'nullable',
            'file_path' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $details = $validated['details'] ?? $validated['title'] ?? $notice->details;

        $notice->update([
            'title' => $validated['title'] ?? $notice->title,
            'details' => $details,
            'bn_details' => $validated['bn_details'] ?? $details,
            'ar_details' => $validated['ar_details'] ?? $details,
            'image' => $validated['image'] ?? $notice->image,
        ]);

        if ($request->hasFile('file_path')) {
            \App\Lib\Image::delete($notice->file_path);
            $path = \App\Lib\Image::storeFile($request->file('file_path'), 'notices_files');
            $notice->update(['file_path' => $path]);
        }

        return redirect()->route('notice.index')->with('success', 'Notice updated successfully!');
    }

    public function destroy(Notice $notice)
    {
        \App\Lib\Image::delete($notice->file_path);
        $notice->delete();

        return redirect()->back()->with('success', 'Notice deleted successfully!');
    }
}
