<?php

namespace App\Observers;

use App\Jobs\SendStudentSmsJob;
use App\Models\Result;

class ResultObserver
{
    public function created(Result $result)
    {
        $this->sendResultSms($result);
    }

    public function updated(Result $result)
    {
        $this->sendResultSms($result);
    }

    protected function sendResultSms(Result $result)
    {
        // Avoid sending repeatedly if not necessary, but here we can just send it.
        $result->loadMissing(['student.subject']);
        $student = $result->student;
        if ($student && $student->phone) {
            $courseName = $student->subject->name ?? 'Course';
            $grade = $result->grade ?? 'N/A';
            $message = "Dear {$student->name}, your result for {$courseName} is published. Grade: {$grade}. Visit our website to check details. - ".config('site.setting.name', 'BDNSI');

            SendStudentSmsJob::dispatch($student->phone, $message);
        }
    }

    /**
     * Handle the Result "deleted" event.
     *
     * @return void
     */
    public function deleted(Result $result)
    {
        //
    }

    /**
     * Handle the Result "restored" event.
     *
     * @return void
     */
    public function restored(Result $result)
    {
        //
    }

    /**
     * Handle the Result "force deleted" event.
     *
     * @return void
     */
    public function forceDeleted(Result $result)
    {
        //
    }
}
