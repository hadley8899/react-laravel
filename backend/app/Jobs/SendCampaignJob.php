<?php

namespace App\Jobs;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignStatus;
use App\Models\Campaign;
use App\Services\Email\EmailDispatcher;
use App\Services\EmailTemplate\LayoutRenderer;
use App\Services\EmailTemplate\MjmlCompiler;
use App\Services\EmailTemplate\HtmlCompiler;
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

    public function handle(
        EmailDispatcher      $mailer,
        LayoutRenderer       $renderer,
        MjmlCompiler         $mjml,
        HtmlCompiler         $htmlCompiler,
        VariableInterpolator $vars
    ): void
    {
        if ($this->campaign->status !== CampaignStatus::Queued) {
            return;
        }

        /* -----------------------------------------------------------
         | 1. Ensure compiled template
         |----------------------------------------------------------- */
        $template = $this->campaign->emailTemplate;

        if (empty($template->html_cached) || empty($template->text_cached)) {
            ['html' => $html, 'text' => $text] = $template->type === 'builder'
                ? $mjml->compile($renderer->toMjml($template->layout_json))
                : $htmlCompiler->compile($template->html_source);

            $template->update(['html_cached' => $html, 'text_cached' => $text]);
        }

        /* -----------------------------------------------------------
         | 2. Generate campaign-level content
         |----------------------------------------------------------- */
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
            // contact-specific interpolation
            $html = $vars->interpolate($htmlBase, null, $contact->customer);
            $text = $vars->interpolate($textBase, null, $contact->customer);
            $subject = $vars->interpolate($subjectBase, null, $contact->customer);

            try {
                /* strip any leftover tags like {{name}} */
                $html = preg_replace('/\{\{.*?}}/', '', $html);
                $text = preg_replace('/\{\{.*?}}/', '', $text);

                $messageId = $mailer->send([
                    'from' => $fromAddress,
                    'to' => $contact->customer->email,
                    'subject' => $subject,
                    'html' => $html,
                    'text' => $text,
                    'reply_to' => $this->campaign->reply_to,
                    'meta' => ['v:campaign_contact_id' => (string)$contact->uuid],
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
