<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DueWarning extends Notification
{
    use Queueable;

    public $dueAmount;
    public $creditLimit;

    public function __construct(float $dueAmount, float $creditLimit)
    {
        $this->dueAmount = $dueAmount;
        $this->creditLimit = $creditLimit;
    }

    public function via($notifiable)
    {
        return ['database']; 
    }

    public function toArray($notifiable)
    {
        return [
            'due_amount' => $this->dueAmount,
            'credit_limit' => $this->creditLimit,
            'message' => 'WARNING: Your current due (' . number_format($this->dueAmount, 2) . ') is approaching your credit limit (' . number_format($this->creditLimit, 2) . '). Please clear your dues.',
        ];
    }
}
