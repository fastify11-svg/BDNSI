<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Subject;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class ExamController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'exam';

    public function index(Request $request)
    {
        if ($request->ajax() && ! $request->header('X-Inertia')) {
            return datatables(Exam::with('subject'))
                ->addIndexColumn()
                ->addColumn('edit_exam', function ($data) {
                    return view('admin.exam.edit', compact('data'))->render();
                })
                ->rawColumns(['edit_exam'])
                ->toJson();
        }
        $exams = Exam::with('subject')->latest()->paginate(25);

        return Inertia::render('Admin/Exam/Index', compact('exams'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.exam.create', [
            'subjects' => Subject::get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|unique:exams,subject_id',
            'name' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);
        Exam::create($validated);

        return response()->success('Successfully Create');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        return view('admin.exam.show', [
            'alldata' => Exam::findOrFail($id),
        ]);
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
        $validated = $request->validate([
            'name' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'status' => 'required',
        ]);
        $data = Exam::findOrFail($id);
        $data->update($validated);

        return response()->success('Successfully Updated');

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
