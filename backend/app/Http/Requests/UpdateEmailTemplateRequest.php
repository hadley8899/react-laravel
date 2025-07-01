<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmailTemplateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
            'subject' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'preview_text' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'layout_json' => [
                'sometimes',
                'required',
                'array',
            ],
            'html_cached' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'text_cached' => [
                'sometimes',
                'nullable',
                'string',
            ],
        ];
    }
}
