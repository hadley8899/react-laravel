<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ContactCustomVariable */
class ContactCustomVariableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'friendly_name' => $this->friendly_name,
            'key' => 'CUSTOMER.' . $this->key,   // ready for merge-tag picker
            'type' => $this->type,
            'meta' => $this->meta,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
