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
        $rules = [
            'friendly_name' => ['required', 'string', 'max:255'],
            'key' => [
                'required',
                'string',
                'max:64',
                'regex:/^[A-Z0-9_]+$/',
            ],
            'type' => ['nullable', 'string', 'max:32'],
            // 'meta'          => ['sometimes', 'array'], // Not currently being used
        ];

        $type = $this->input('type');

        if ($type === 'image') {
            $rules['value'] = ['required', 'file', 'image', 'max:5120'];
        } elseif ($type === 'color') {
            $rules['value'] = ['required', 'regex:/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/'];
        } else {
            $rules['value'] = ['required', 'string'];
        }

        return $rules;
    }
}
