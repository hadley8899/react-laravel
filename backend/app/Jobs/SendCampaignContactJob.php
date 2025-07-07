<?php
// TODO I think this class is dead code, but leaving it here for now

//
//namespace App\Jobs;
//
//use App\Enums\CampaignContactStatus;
//use App\Models\CampaignContact;
//use App\Services\EmailTemplate\VariableInterpolator;
//use Illuminate\Bus\Queueable;
//use Illuminate\Contracts\Queue\ShouldQueue;
//use Illuminate\Foundation\Bus\Dispatchable;
//use Illuminate\Queue\InteractsWithQueue;
//use Illuminate\Queue\SerializesModels;
//use Illuminate\Support\Facades\Log;
//use Mailgun\Mailgun;
//
//class SendCampaignContactJob implements ShouldQueue
//{
//    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
//
//    public $queue = 'mail';
//    public int $tries = 3;
//
//    public function __construct(public int $campaignContactId)
//    {
//    }
//
//    public function handle(VariableInterpolator $vars): void
//    {
//        /** @var CampaignContact $cc */
//        $cc = CampaignContact::with([
//            'campaign.emailTemplate',
//            'campaign.fromAddress.sendingDomain',
//            'customer',
//        ])->findOrFail($this->campaignContactId);
//
//        if ($cc->status !== CampaignContactStatus::Pending->value) {
//            return; // idempotent
//        }
//
//        $campaign = $cc->campaign;
//        $template = $campaign->emailTemplate;
//        $customer = $cc->customer;
//        $from = $campaign->fromAddress;
//        $domain = $from->sendingDomain;
//
//        Log::info('Customer', [
//            'customer_id' => $customer->id,
//            'email' => $customer->email,
//            'campaign_contact_id' => $cc->id,
//            'campaign_id' => $campaign->id,
//        ]);
//
//        // Per-recipient merge vars
//        $html = $vars->interpolate($template->html_cached, null, $customer);
//        $text = $vars->interpolate($template->text_cached, null, $customer);
//        $subject = $vars->interpolate($campaign->subject, null, $customer);
//
//        $mg = Mailgun::create(config('services.mailgun.secret'));
//
//        try {
//            $resp = $mg->messages()->send($domain->domain, [
//                'from' => sprintf('%s <%s@%s>',
//                    $from->name ?: $from->local_part,
//                    $from->local_part, $domain->domain),
//                'to' => $customer->email,
//                'subject' => $subject,
//                'html' => $html,
//                'text' => $text,
//                'h:Reply-To' => $campaign->reply_to ?? null,
//                // handy vars for webhooks
//                'v:campaign_contact_id' => (string)$cc->uuid,
//            ]);
//
//            $cc->update([
//                'status' => CampaignContactStatus::Sent,
//                'provider_message_id' => $resp->getId(),
//                'sent_at' => now(),
//            ]);
//        } catch (\Throwable $e) {
//            $cc->update([
//                'status' => CampaignContactStatus::Failed,
//                'error_message' => $e->getMessage(),
//            ]);
//            throw $e; // allow retry / failed_jobs
//        }
//    }
//}
