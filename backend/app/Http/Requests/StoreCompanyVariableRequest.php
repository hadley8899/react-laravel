<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyVariableRequest extends FormRequest
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
            'friendly_name' => ['required', 'string', 'max:255'],
            'key'   => [
                'required',
                'string',
                'max:64',
                'regex:/^[A-Z0-9_]+$/',
            ],
            'value' => ['required', 'string'],
            'type'  => ['nullable', 'string', 'max:32'],
            'meta'  => ['sometimes', 'array'],
        ];
    }
}
