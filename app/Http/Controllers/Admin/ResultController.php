<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CenterStatus;
use App\Enums\SessionStatus;
use App\Enums\StudentStatus;
use App\Http\Controllers\Controller;
use App\Jobs\SendStudentSmsJob;
use App\Models\Center;
use App\Models\Result;
use App\Models\SemesterResult;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Traits\ChecksPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResultController extends Controller
{
    use ChecksPermission;

    protected $permissionPrefix = 'result';

    public function index(Request $request)
    {
        $students = collect([]);
        if ($request->has(['center', 'session', 'subject'])) {
            $students = Student::where([
                'center_id' => $request->get('center'),
                'session_id' => $request->get('session'),
                'subject_id' => $request->get('subject'),
            ])
                ->whereStatus(StudentStatus::Approved)
                ->with('result')->get();
        }

        return Inertia::render('Admin/Result/Index', [
            'students' => $students,
            'centers' => Center::select(['id', 'code', 'name'])->whereStatus(CenterStatus::Approved)->get(),
            'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
            'subjects' => Subject::select(['id', 'name'])->get(),
        ]);
    }

    public function create(Request $request)
    {
        $students = collect([]);
        if ($request->has(['roll'])) {
            $students = Student::where(
                'roll', $request->get('roll'))
                ->whereStatus(StudentStatus::Approved)
                ->with(['result', 'semesterResults'])->get();
        }

        return Inertia::render('Admin/Result/Create', [
            'students' => $students,
            'centers' => Center::select(['id', 'code', 'name'])->whereStatus(CenterStatus::Approved)->get(),
            'sessions' => Session::select(['id', 'name'])->where('status', SessionStatus::Active)->get(),
            'subjects' => Subject::select(['id', 'name'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'written' => 'nullable|numeric',
            'practical' => 'nullable|numeric',
            'viva' => 'nullable|numeric',
            'publish_semesters' => 'nullable|boolean',
        ]);

        try {
            $written = $request->get('written');
            $practical = $request->get('practical');
            $viva = $request->get('viva');
            DB::beginTransaction();
            $student = Student::find($request->id);

            // Save final result if provided
            if ($request->has('written') && $request->has('practical') && $request->has('viva') &&
                $request->written !== null && $request->practical !== null && $request->viva !== null) {
                Result::updateOrCreate(['student_id' => $request->id],
                    [
                        'written' => $request->get('written'),
                        'practical' => $request->get('practical'),
                        'viva' => $request->get('viva'),
                    ]);
            }

            // Save semester results if provided
            if ($request->has('publish_semesters') && $request->publish_semesters) {
                SemesterResult::where('student_id', $request->id)->delete();

                $durationStr = $student->subject->duration ?? '';
                $lowerDuration = strtolower($durationStr);
                $numSemesters = 1;
                if (strpos($lowerDuration, '4 year') !== false || strpos($lowerDuration, '48 month') !== false) {
                    $numSemesters = 8;
                } elseif (strpos($lowerDuration, '3 year') !== false || strpos($lowerDuration, '36 month') !== false) {
                    $numSemesters = 6;
                } elseif (strpos($lowerDuration, '2 year') !== false || strpos($lowerDuration, '24 month') !== false) {
                    $numSemesters = 4;
                } elseif (strpos($lowerDuration, '1 year') !== false || strpos($lowerDuration, '12 month') !== false) {
                    $numSemesters = 2;
                } elseif (strpos($lowerDuration, '6 month') !== false) {
                    $numSemesters = 1;
                }

                $courseType = $student->course_type;
                $typeStr = is_object($courseType) ? ($courseType->value ?? $courseType->description) : $courseType;

                $limit = 100;
                if ($typeStr == 0 || $typeStr === '0' || $typeStr === 'Regular') {
                    $limit = 100;
                } elseif ($typeStr == 1 || $typeStr === '1' || $typeStr === 'Short_Course' || $typeStr === 'Short Course') {
                    $limit = 1200;
                } elseif ($typeStr == 2 || $typeStr === '2' || $typeStr === 'Diploma') {
                    $limit = 4800;
                }

                $totalMarks = (int) $written + (int) $practical + (int) $viva;
                $percentage = ($limit > 0) ? ($totalMarks / $limit) * 100 : 0;

                $targetCgpa = 0.00;

                // Dynamic Grading Scale Engine
                $gradeScale = \App\Models\GradeScale::where('course_type', $typeStr)->first();
                if ($gradeScale && is_array($gradeScale->rules) && count($gradeScale->rules) > 0) {
                    $limit = $gradeScale->max_marks > 0 ? $gradeScale->max_marks : $limit;
                    $percentage = ($limit > 0) ? ($totalMarks / $limit) * 100 : 0;
                    
                    foreach ($gradeScale->rules as $rule) {
                        if ($percentage >= $rule['min_percent'] && $percentage <= $rule['max_percent']) {
                            $targetCgpa = (float) $rule['cgpa']; // Assuming rules store cgpa
                            break;
                        }
                    }
                } else {
                    // Fallback to legacy hardcoded rules
                    if ($percentage >= 80) {
                        $targetCgpa = 4.00;
                    } elseif ($percentage >= 75) {
                        $targetCgpa = 3.75;
                    } elseif ($percentage >= 70) {
                        $targetCgpa = 3.50;
                    } elseif ($percentage >= 65) {
                        $targetCgpa = 3.25;
                    } elseif ($percentage >= 60) {
                        $targetCgpa = 3.00;
                    } elseif ($percentage >= 55) {
                        $targetCgpa = 2.75;
                    } elseif ($percentage >= 50) {
                        $targetCgpa = 2.50;
                    } elseif ($percentage >= 45) {
                        $targetCgpa = 2.25;
                    } elseif ($percentage >= 40) {
                        $targetCgpa = 2.00;
                    } else {
                        $targetCgpa = 0.00;
                    }
                }

                $baseGrades = [
                    '4.00' => 'A+',
                    '3.75' => 'A',
                    '3.50' => 'A-',
                    '3.25' => 'B+',
                    '3.00' => 'B',
                    '2.75' => 'B-',
                    '2.50' => 'C+',
                    '2.25' => 'C',
                    '2.00' => 'D',
                    '0.00' => 'F',
                ];

                // Generate subjects for all semesters to strictly match the target CGPA
                $totalSubjects = $numSemesters * 5;
                $grades = array_fill(0, $totalSubjects, $targetCgpa);

                if ($targetCgpa > 0.00 && $targetCgpa < 4.00) {
                    $jitterCount = (int) floor($totalSubjects / 2);
                    for ($i = 0; $i < $jitterCount; $i++) {
                        $idx1 = rand(0, $totalSubjects - 1);
                        $idx2 = rand(0, $totalSubjects - 1);
                        if ($idx1 != $idx2 && $grades[$idx1] <= 3.75 && $grades[$idx2] >= 2.25) {
                            $grades[$idx1] += 0.25;
                            $grades[$idx2] -= 0.25;
                        }
                    }
                }

                $gradeIndex = 0;
                for ($sem = 1; $sem <= $numSemesters; $sem++) {
                    $semName = $sem.($sem == 1 ? 'st' : ($sem == 2 ? 'nd' : ($sem == 3 ? 'rd' : 'th'))).' Semester';

                    $subjects = [];
                    $semTotalPoints = 0;
                    for ($sub = 1; $sub <= 5; $sub++) {
                        $subjectName = $student->subject->name.' - Paper '.$sub;
                        if ($sem == $numSemesters) {
                            if ($sub == 3) {
                                $subjectName = 'Internship';
                            }
                            if ($sub == 4) {
                                $subjectName = 'Practical';
                            }
                            if ($sub == 5) {
                                $subjectName = 'Viva';
                            }
                        }

                        $point = number_format($grades[$gradeIndex], 2, '.', '');
                        $gradeStr = $baseGrades[$point] ?? 'A+';

                        $subjects[] = [
                            'name' => $subjectName,
                            'credit' => 4,
                            'grade' => $gradeStr,
                            'point' => $point,
                            'total_point' => number_format($point * 4, 2, '.', ''),
                        ];

                        $semTotalPoints += ($point * 4);
                        $gradeIndex++;
                    }

                    $semGpa = $semTotalPoints / (5 * 4);

                    SemesterResult::create([
                        'student_id' => $request->id,
                        'semester_name' => $semName,
                        'semester_gpa' => $semGpa,
                        'subjects_data' => $subjects,
                    ]);
                }
            } else {
                // if unchecked, maybe we clear the semesters?
                SemesterResult::where('student_id', $request->id)->delete();
            }

            $message = 'Congratulation!! '.$student->name.', You have successfully filled the application form for  '.$student->center->name.' '.$student->subject->name.' course under Young Technical Training. Your Roll No: '.$student->roll.' and Registration No: '.$student->registration.'. Thanks for staying with '.config('site.setting.name');
            SendStudentSmsJob::dispatch($student->phone, $message);

            DB::commit();

            return response()->success('Result published successfully');
        } catch (\Exception $ex) {
            DB::rollBack();

            return response()->error($ex->getMessage());
        }

        return response()->error('Something went wrong');
    }

    public function show($id)
    {
        $student = Student::findOrFail($id);
        $student->load(['result', 'center', 'session', 'subject']);

        return Inertia::render('Admin/Result/Show', [
            'student' => $student,
        ]);
    }

    public function destroy(Result $result)
    {
        //
    }
}
