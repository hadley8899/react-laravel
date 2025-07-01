<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmailTemplateRequest extends FormRequest
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
                'required',
                'string',
                'max:255',
                'unique:email_templates,name,NULL,id,company_id,' . $this->user()->company_id,
            ],
            'subject' => [
                'nullable',
                'string',
                'max:255',
            ],
            'preview_text' => [
                'nullable',
                'string',
                'max:255',
            ],
            'layout_json' => [
                'required',
                'array',
            ],
        ];
    }
}
