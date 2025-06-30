<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CompanyVariableResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isImage = $this->type === 'image';

        return [
            'uuid' => $this->uuid,
            'friendly_name' => $this->friendly_name,
            'key' => $this->key,
            'value' => $this->value,
            'url' => $isImage ? Storage::disk('variables')->url($this->value) : null,
            'type' => $this->type,
            'meta' => $this->meta,
            'can_be_deleted' => $this->can_be_deleted,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
