<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactCustomVariableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $companyId = $this->user()->company_id;
        $customVariable = $this->route('customVariable');

        return [
            'friendly_name' => ['sometimes', 'string', 'max:255'],
            'key' => [
                'sometimes',
                'string',
                'max:255',
                'regex:/^[A-Z0-9_]+$/',
                Rule::unique('contact_custom_variables', 'key')
                    ->ignore($customVariable->id)
                    ->where('company_id', $companyId),
            ],
            'type' => ['sometimes', 'in:text,image'],
            'meta' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return ['key.regex' => 'Key may contain only uppercase letters, numbers and underscores.'];
    }
}
