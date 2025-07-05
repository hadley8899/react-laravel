<?php

namespace App\Jobs;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignStatus;
use App\Models\Campaign;
use App\Models\CampaignContact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Mailgun\Mailgun;

class SendCampaignJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Campaign $campaign)
    {
    }

    public function handle(): void
    {
        if ($this->campaign->status !== CampaignStatus::Queued) {
            return;
        }

        $this->campaign->update(['status' => CampaignStatus::Processing]);

        $mg = Mailgun::create(config('services.mailgun.secret'));

        /** @var \Illuminate\Support\Collection $contacts */
        $contacts = $this->campaign->contacts()->where('status', CampaignContactStatus::Pending)->get();

        foreach ($contacts as $contact) {
            try {
                $response = $mg->messages()->send(
                    config('services.mailgun.domain'),
                    [
                        'from' => optional($this->campaign->fromAddress)->email ?? config('mail.from.address'),
                        'to' => $contact->customer->email,
                        'subject' => $this->campaign->subject,
                        'text' => '...', // Rendered body
                        'html' => '...', // Rendered HTML
                        'h:Reply-To' => $this->campaign->reply_to,
                    ]
                );

                $contact->update([
                    'status' => CampaignContactStatus::Sent,
                    'sent_at' => now(),
                    'provider_message_id' => $response->getId(),
                ]);
            } catch (\Throwable $e) {
                Log::error('Mailgun send failed', ['error' => $e->getMessage()]);
                $contact->update([
                    'status' => CampaignContactStatus::Failed,
                    'error_message' => $e->getMessage(),
                ]);
            }
        }

        $failed = $this->campaign->contacts()->where('status', CampaignContactStatus::Failed)->exists();

        $this->campaign->update([
            'status' => $failed ? CampaignStatus::Failed : CampaignStatus::Sent,
            'sent_at' => now(),
            'error_message' => $failed ? 'Some contacts failed. See contact rows.' : null,
        ]);
    }
}
