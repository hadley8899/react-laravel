<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppointmentCreated extends Notification
{
    use Queueable;

    public function __construct(public $appointment)
    {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $bookingType = $this->appointment->service_type ?? 'unknown';
        $date = $this->appointment->date_time->format('Y-m-d H:i:s');
        return [
            'appointment_id' => $this->appointment->id,
            'message' => "$notifiable->name, a new booking of type $bookingType was created for $date.",
            'created_by' => auth()->id(),
        ];
    }
}
