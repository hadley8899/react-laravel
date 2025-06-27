<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailTemplateResource extends JsonResource
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
            'name' => $this->name,
            'subject' => $this->subject,
            'preview_text' => $this->preview_text,
            'layout_json' => $this->layout_json,
            'html_cached' => $this->html_cached,
            'text_cached' => $this->text_cached,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'created_by' => $this->created_by,
        ];
    }
}
