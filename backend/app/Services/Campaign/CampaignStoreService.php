<?php

namespace App\Services\Campaign;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignStatus;
use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use App\Models\CampaignContact;
use App\Models\Customer;
use App\Models\EmailTemplate;
use App\Models\FromAddress;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CampaignStoreService extends CampaignService
{
    private array $errors = [];

    public function addError(string $error): void
    {
        $this->errors[] = $error;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * @param string $templateUuId
     * @param array $tagUuIds
     * @param string $fromAddressUuid
     * @param string $subject
     * @param string $preheaderText
     * @param string|null $replyTo
     * @param string|null $scheduledAtInput
     * @return Campaign|null
     */
    public function storeCampaign(
        string  $templateUuId,
        array   $tagUuIds,
        string  $fromAddressUuid,
        string  $subject,
        string  $preheaderText,
        ?string $replyTo,
        ?string $scheduledAtInput
    ): ?Campaign
    {
        $company = Auth::user()->company;
        $template = EmailTemplate::query()->where('uuid', '=', $templateUuId)->firstOrFail();

        $tagIds = Tag::query()->whereIn('uuid', $tagUuIds)->pluck('id');
        if ($tagIds->isEmpty()) {
            $this->addError('No valid tags provided.');
            return null;
        }

        $from = FromAddress::query()->where('uuid', $fromAddressUuid)
            ->where('company_id', $company->id)
            ->where('verified', true)
            ->firstOrFail();

        $scheduledAt = $scheduledAtInput
            ? Carbon::parse($scheduledAtInput)->timezone('UTC')
            : null;

        $status = $scheduledAt && $scheduledAt->isFuture()
            ? CampaignStatus::Scheduled
            : CampaignStatus::Queued;

        $campaign = DB::transaction(function () use (
            $company,
            $subject,
            $preheaderText,
            $template,
            $tagIds,
            $from,
            $replyTo,
            $scheduledAt,
            $status,
        ) {
            $campaign = $company->campaigns()->create([
                'email_template_id' => $template->id,
                'subject' => $subject,
                'preheader_text' => $preheaderText,
                'from_address_id' => $from->id,
                'reply_to' => $replyTo,
                'contact_tag_ids' => $tagIds,
                'status' => $status,
                'scheduled_at' => $scheduledAt,
            ]);

            /* snapshot of recipients */
            $customerIds = Customer::query()->where('company_id', $company->id)
                ->whereHas('tags', fn($q) => $q->whereIn('tags.id', $tagIds))
                ->pluck('customers.id');

            $payload = $customerIds->map(fn($cid) => [
                'uuid' => CampaignContact::generateUuid(),
                'campaign_id' => $campaign->id,
                'customer_id' => $cid,
                'status' => CampaignContactStatus::Pending,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ])->all();

            CampaignContact::query()->insert($payload);

            return $campaign;
        });

        /* ---------- enqueue immediately if not future ---------- */
        if (is_null($campaign->scheduled_at) || !$campaign->scheduled_at->isFuture()) {
            SendCampaignJob::dispatch($campaign)->onQueue('mail');
        }

        return $campaign;
    }
}
