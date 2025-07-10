<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmailTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', Rule::in(['builder', 'html'])],

            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'subject' => ['sometimes', 'nullable', 'string', 'max:255'],
            'preview_text' => ['sometimes', 'nullable', 'string', 'max:255'],

            'layout_json' => ['sometimes', 'required_if:type,builder', 'array'],
            'html_source' => ['sometimes', 'required_if:type,html', 'string'],

            'html_cached' => ['sometimes', 'nullable', 'string'],
            'text_cached' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
