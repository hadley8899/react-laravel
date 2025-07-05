<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SendingDomainResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'domain' => $this->domain,
            'state' => $this->state,
            'dns_records' => $this->dns_records,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
