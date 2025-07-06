<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactCustomVariableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $companyId = $this->user()->company_id;

        return [
            'friendly_name' => ['required', 'string', 'max:255'],
            'key' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Z0-9_]+$/',
                'unique:contact_custom_variables,key,NULL,id,company_id,' . $companyId,
            ],
            'type' => ['required', 'in:text,image'],
            'meta' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return ['key.regex' => 'Key may contain only uppercase letters, numbers and underscores.'];
    }
}
