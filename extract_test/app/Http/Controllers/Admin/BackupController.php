<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $backupDir = storage_path('app/backups');

        if (! File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $files = collect(File::files($backupDir))
            ->filter(fn ($file) => $file->getExtension() === 'sql')
            ->map(function ($file) {
                return [
                    'name' => $file->getFilename(),
                    'size' => $file->getSize(),
                    'date' => $file->getMTime(),
                ];
            })
            ->sortByDesc('date')
            ->values();

        return Inertia::render('Admin/Backup/Index', [
            'files' => $files,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $filename)
    {
        $filename = basename($filename);

        // Security: Only allow .sql files to be downloaded
        if (! str_ends_with($filename, '.sql')) {
            abort(403, 'Only SQL backup files can be downloaded.');
        }

        $path = 'backups/'.$filename;

        if (! Storage::disk('local')->exists($path)) {
            abort(404, 'Backup file not found.');
        }

        return Storage::download($path);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
