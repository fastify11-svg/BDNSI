<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CenterSuspended extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reason;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($reason = 'Your center has been suspended due to policy violations.')
    {
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database']; // Keeping it to database for now to match other notifications
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
            'title' => 'Center Suspended',
            'message' => $this->reason,
            'type' => 'danger'
        ];
    }
}
