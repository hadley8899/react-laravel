<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmailTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $companyId = $this->user()->company_id;

        return [
            'type' => ['required', Rule::in(['builder', 'html'])],

            // Shared
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('email_templates', 'name')
                    ->where('company_id', $companyId),
            ],
            'subject' => ['nullable', 'string', 'max:255'],
            'preview_text' => ['nullable', 'string', 'max:255'],

            // Builder-only
            'layout_json' => ['required_if:type,builder', 'array'],
            // Raw-HTML-only
            'html_source' => ['required_if:type,html', 'string'],
        ];
    }
}
