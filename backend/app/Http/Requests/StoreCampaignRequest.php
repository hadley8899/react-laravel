<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_uuid' => ['required', 'uuid', 'exists:email_templates,uuid'],
            'subject' => ['required', 'string', 'max:255'],
            'preheader_text' => ['nullable', 'string', 'max:255'],
            'from_address_uuid' => ['required', 'uuid', 'exists:from_addresses,uuid'],
            'reply_to' => ['nullable', 'email'],
            'tag_uuids' => ['required', 'array', 'min:1'],
            'tag_uuids.*' => ['uuid', 'exists:tags,uuid'],
            // 2025-07-06T21:09:00.000Z
            'scheduled_at' => ['nullable', 'date_format:Y-m-d\TH:i:s.v\Z', 'after_or_equal:now'],
        ];
    }
}
