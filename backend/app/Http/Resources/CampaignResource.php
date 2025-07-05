<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'subject' => $this->subject,
            'preheader_text' => $this->preheader_text,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at,
            'sent_at' => $this->sent_at,
            'total_contacts' => $this->contacts_count,
            'template' => [
                'uuid' => $this->emailTemplate->uuid ?? null,
                'name' => $this->emailTemplate->name ?? null,
            ],
            'from_address' => $this->fromAddress?->email,
            'reply_to' => $this->reply_to,
            'created_at' => $this->created_at,
        ];
    }
}
