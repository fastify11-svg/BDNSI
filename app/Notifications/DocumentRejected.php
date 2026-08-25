<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\StudentDocument;

class DocumentRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $document;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(StudentDocument $document)
    {
        $this->document = $document;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'message' => 'Document REJECTED for student ' . $this->document->student->name . '. Reason: ' . $this->document->rejected_reason,
            'student_id' => $this->document->student_id,
            'document_id' => $this->document->id,
            'type' => 'document_rejected'
        ];
    }
}
