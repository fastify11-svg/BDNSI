<?php

namespace App\Observers;

use App\Enums\StudentStatus;
use App\Jobs\SendStudentSmsJob;
use App\Models\Student;

class StudentObserver
{
    /**
     * Handle the Student "created" event.
     *
     * @return void
     */
    public function created(Student $student)
    {
        $statusValue = is_object($student->status) ? $student->status->value : $student->status;
        if ($statusValue == StudentStatus::Approved) {
            $student->loadMissing('subject');
            $courseName = $student->subject->name ?? 'Course';
            $message = "Dear {$student->name}, your registration for {$courseName} has been approved successfully. Your Roll No is {$student->roll}. - ".config('site.setting.name', 'BDNSI');

            SendStudentSmsJob::dispatch($student->phone, $message);

            // Generate License automatically
            $licenseNumber = $student->registration ?? $student->roll ?? uniqid('LIC-');
            if ($student->nid_or_birth) {
                    try {
                    \App\Models\License::updateOrCreate(
                        ['cnic' => $student->nid_or_birth],
                        [
                            'name'           => $student->name,
                            'father_name'    => $student->fathers_name ?? 'N/A',
                            'city'           => $student->present_address ?? 'N/A',
                            'license_number' => $licenseNumber,
                            'issue_date'     => now(),
                            'valid_from'     => now(),
                            'valid_to'       => now()->addYears(5),
                            'credential_type' => 'Vocational Certificate',
                        ]
                    );
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('License auto-generate failed: '.$e->getMessage(), [
                        'student_id' => $student->id,
                        'cnic'       => $student->nid_or_birth,
                    ]);
                }
            }
        }
    }

    public function updated(Student $student)
    {
        // Check if status was changed to Approved
        $statusValue = is_object($student->status) ? $student->status->value : $student->status;
        if ($student->isDirty('status') && $statusValue == StudentStatus::Approved) {
            $student->loadMissing('subject');
            $courseName = $student->subject->name ?? 'Course';
            $message = "Dear {$student->name}, your registration for {$courseName} has been approved successfully. Your Roll No is {$student->roll}. - ".config('site.setting.name', 'BDNSI');

            SendStudentSmsJob::dispatch($student->phone, $message);

            // Generate License automatically
            $licenseNumber = $student->registration ?? $student->roll ?? uniqid('LIC-');
            if ($student->nid_or_birth) {
                            \App\Models\License::updateOrCreate(
                    ['cnic' => $student->nid_or_birth],
                    [
                        'name'           => $student->name,
                        'father_name'    => $student->fathers_name ?? 'N/A',
                        'city'           => $student->present_address ?? 'N/A',
                        'license_number' => $licenseNumber,
                        'issue_date'     => now(),
                        'valid_from'     => now(),
                        'valid_to'       => now()->addYears(5),
                        'credential_type' => 'Vocational Certificate',
                    ]
                );
            }
        }
    }

    /**
     * Handle the Student "deleted" event.
     *
     * @return void
     */
    public function deleted(Student $student)
    {
        //
    }

    /**
     * Handle the Student "restored" event.
     *
     * @return void
     */
    public function restored(Student $student)
    {
        //
    }

    /**
     * Handle the Student "force deleted" event.
     *
     * @return void
     */
    public function forceDeleted(Student $student)
    {
        //
    }
}
