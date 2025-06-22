<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AdminPasswordReset extends Notification
{
    use Queueable;

    protected string $newPassword;

    public function __construct(string $newPassword)
    {
        $this->newPassword = $newPassword;
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $frontendUrl = env('FRONTEND_URL', config('app.url')) . '/login';
        $companyName = $notifiable->company->name ?? config('app.name');

        return (new MailMessage)
            ->subject('Your Password Has Been Reset')
            ->greeting('Hello ' . ($notifiable->name ?? '') . '!')
            ->line('An administrator has reset your password for your account at ' . $companyName . '.')
            ->line('Your new temporary password is:')
            ->line('**' . $this->newPassword . '**')
            ->action('Login', $frontendUrl)
            ->line('For security, please log in and change your password as soon as possible.')
            ->salutation('Regards, ' . $companyName);
    }
}
