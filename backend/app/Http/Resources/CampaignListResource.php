<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignListResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'subject' => $this->subject,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at,
            'sent_at' => $this->sent_at,
            'total_contacts' => $this->contacts_count,
        ];
    }
}
