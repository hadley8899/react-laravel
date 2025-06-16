<?php

namespace App\Notifications;

use App\Models\Company;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserInvite extends Notification implements ShouldQueue
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
        return ['mail'];
    }


    /**
     * Get the mail representation of the notification.
     *
     * @param object $notifiable The notifiable entity.
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $acceptInvitationUrl = url($frontendUrl . '/accept-invitation?token=' . $this->newUser->invitation_token);

        return new MailMessage()
            ->subject('You have been invited to join ' . $this->company->name)
            ->greeting('Hello ' . $this->newUser->name . ',')
            ->line('You have been invited to join the company ' . $this->company->name . '.')
            ->line('Please click the button below to accept the invitation and set your password.')
            ->action('Accept Invitation', $acceptInvitationUrl)
            ->line('If you did not expect this invitation, you can ignore this email.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param object $notifiable The notifiable entity.
     * @return array<string, int|string>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'user_id' => $this->newUser->id,
            'company_id' => $this->company->id,
            'message' => 'You have been invited to join ' . $this->company->name,
        ];
    }
}
