<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YoutubeVideo;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YoutubeVideoController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'youtube-video';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(YoutubeVideo::latest()->get())->addIndexColumn()->toJson();
        }

        $query = YoutubeVideo::latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('video_id', 'like', "%{$search}%");
            });
        }

        $videos = $query->paginate(20)->withQueryString();

        $filters = [
            'search' => $request->input('search', ''),
        ];

        return Inertia::render('Admin/YoutubeVideo/Index', [
            'videos' => $videos,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/YoutubeVideo/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'link' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'nullable|integer',
        ]);

        $videoId = $this->extractYoutubeVideoId($validated['link']);

        if (! $videoId) {
            return redirect()->back()->withErrors(['link' => 'Invalid YouTube URL or Video ID. Please paste a valid YouTube video link.']);
        }

        YoutubeVideo::create([
            'title' => $validated['title'],
            'link' => $validated['link'],
            'video_id' => $videoId,
            'description' => $validated['description'] ?? '',
            'status' => $validated['status'] ?? 1,
            'image' => "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg",
        ]);

        return redirect()->route('youtube-video.index')->with('success', 'YouTube Video added successfully!');
    }

    public function edit(YoutubeVideo $youtubeVideo)
    {
        return Inertia::render('Admin/YoutubeVideo/Edit', [
            'video' => $youtubeVideo,
        ]);
    }

    public function update(Request $request, YoutubeVideo $youtubeVideo)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'link' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'nullable|integer',
        ]);

        $videoId = $this->extractYoutubeVideoId($validated['link']);

        if (! $videoId) {
            return redirect()->back()->withErrors(['link' => 'Invalid YouTube URL or Video ID.']);
        }

        $youtubeVideo->update([
            'title' => $validated['title'],
            'link' => $validated['link'],
            'video_id' => $videoId,
            'description' => $validated['description'] ?? '',
            'status' => $validated['status'] ?? $youtubeVideo->status ?? 1,
            'image' => "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg",
        ]);

        return redirect()->route('youtube-video.index')->with('success', 'YouTube Video updated successfully!');
    }

    public function destroy(YoutubeVideo $youtubeVideo)
    {
        $youtubeVideo->delete();

        return redirect()->back()->with('success', 'YouTube Video deleted successfully!');
    }

    public function extractYoutubeVideoId($url)
    {
        if (empty($url)) {
            return null;
        }

        $url = trim($url);

        if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $url)) {
            return $url;
        }

        preg_match(
            '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i',
            $url,
            $matches
        );

        return $matches[1] ?? null;
    }
}
