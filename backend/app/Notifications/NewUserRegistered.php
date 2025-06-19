<?php

namespace App\Notifications;

use App\Models\Company;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The newly registered user instance.
     *
     * @var User
     */
    public User $newUser;

    /**
     * The company the user registered for.
     *
     * @var Company
     */
    public Company $company;

    /**
     * Create a new notification instance.
     *
     * @param User $newUser The user who has just registered.
     * @param Company $company The company they belong to.
     */
    public function __construct(User $newUser, Company $company)
    {
        $this->newUser = $newUser;
        $this->company = $company;
    }

    /**
     * Get the notification's delivery channels.
     *
     * Defines how the notification should be delivered.
     * 'mail' sends an email.
     * 'database' stores it in the notifications table for display in the UI.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param object $notifiable The user receiving the notification (Admin/Manager).
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendURL = env('FRONTEND_URL', 'http://localhost:5173');
        return (new MailMessage)
            ->subject('New User Registration Requires Approval')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new user has registered for your company, ' . $this->company->name . ', and requires your approval.')
            ->line('User Name: ' . $this->newUser->name)
            ->line('User Email: ' . $this->newUser->email)
            ->action('View Users', url($frontendURL . 'user-management'))
            ->line('Please review their registration and approve or deny their account.');
    }

    /**
     * Get the array representation of the notification.
     *
     * This data will be stored as JSON in the 'data' column of the notifications table.
     *
     * @param object $notifiable The user receiving the notification.
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return [
            'new_user_id' => $this->newUser->id,
            'new_user_name' => $this->newUser->name,
            'company_name' => $this->company->name,
            'message' => "User '{$this->newUser->name}' has registered and requires approval.",
            'link' => $frontendUrl . '/user-management',
        ];
    }
}
