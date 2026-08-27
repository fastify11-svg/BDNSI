<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentRegistered extends Notification
{
    use Queueable;

    public $student;

    public function __construct(\App\Models\Student $student)
    {
        $this->student = $student;
    }

    public function via($notifiable)
    {
        return ['database']; 
    }

    public function toArray($notifiable)
    {
        return [
            'student_id' => $this->student->id,
            'name' => $this->student->name,
            'registration' => $this->student->registration,
            'message' => 'New student registered: ' . $this->student->name . ' (' . $this->student->registration . ')',
        ];
    }
}
