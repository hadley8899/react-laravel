<?php

namespace App\Jobs;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignStatus;
use App\Models\Campaign;
use App\Services\Email\EmailDispatcher;
use App\Services\EmailTemplate\LayoutRenderer;
use App\Services\EmailTemplate\MjmlCompiler;
use App\Services\EmailTemplate\VariableInterpolator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Campaign $campaign)
    {
    }

    public function handle(EmailDispatcher $mailer): void
    {
        if ($this->campaign->status !== CampaignStatus::Queued) {
            return;
        }

        /* -----------------------------------------------------------
         | 1. Ensure compiled template
         |----------------------------------------------------------- */
        $template = $this->campaign->emailTemplate;

        if (empty($template->html_cached) || empty($template->text_cached)) {
            ['html' => $html, 'text' => $text] = app(MjmlCompiler::class)->compile(
                app(LayoutRenderer::class)->toMjml($template->layout_json)
            );
            $template->update(['html_cached' => $html, 'text_cached' => $text]);
        }

        /* -----------------------------------------------------------
         | 2. Generate campaign-level content
         |----------------------------------------------------------- */
        $vars = app(VariableInterpolator::class);
        $company = $this->campaign->company;

        $htmlBase = $vars->interpolate($template->html_cached, $company);
        $textBase = $vars->interpolate($template->text_cached, $company);
        $subjectBase = $vars->interpolate($this->campaign->subject, $company);
        $fromAddress = optional($this->campaign->fromAddress)->email
            ?? config('mail.from.address');

        $this->campaign->update(['status' => CampaignStatus::Processing]);

        /* -----------------------------------------------------------
         | 3. Iterate contacts
         |----------------------------------------------------------- */
        $contacts = $this->campaign->contacts()
            ->where('status', CampaignContactStatus::Pending)
            ->with('customer')
            ->get();

        foreach ($contacts as $contact) {
            try {
                $messageId = $mailer->send([
                    'from' => $fromAddress,
                    'to' => $contact->customer->email,
                    'subject' => $subjectBase,
                    'html' => $htmlBase,
                    'text' => $textBase,
                    'reply_to' => $this->campaign->reply_to,
                    'meta' => [
                        'v:campaign_contact_id' => (string)$contact->uuid,
                    ],
                ]);

                $contact->update([
                    'status' => CampaignContactStatus::Sent,
                    'sent_at' => now(),
                    'provider_message_id' => $messageId,
                ]);
            } catch (Throwable $e) {
                Log::error('Send failed', ['error' => $e->getMessage()]);
                $contact->update([
                    'status' => CampaignContactStatus::Failed,
                    'error_message' => $e->getMessage(),
                ]);
            }
        }

        /* -----------------------------------------------------------
         | 4. Finalise campaign
         |----------------------------------------------------------- */
        $failed = $this->campaign->contacts()
            ->where('status', CampaignContactStatus::Failed)
            ->exists();

        $this->campaign->update([
            'status' => $failed ? CampaignStatus::Failed : CampaignStatus::Sent,
            'sent_at' => now(),
            'error_message' => $failed ? 'Some contacts failed. See contact rows.' : null,
        ]);
    }
}
