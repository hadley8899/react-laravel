<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyVariableRequest extends FormRequest
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
        $currentType = $this->route('companyVariable')->type;
        $incomingType = $this->input('type', $currentType);

        $rules = [
            'type' => ['sometimes', 'string', 'max:32'],
            // 'meta' => ['sometimes', 'array'], // Not currently being used
        ];

        if ($incomingType === 'image') {
            $rules['value'] = ['sometimes', 'file', 'image', 'max:5120'];
        } elseif ($incomingType === 'color') {
            $rules['value'] = ['sometimes', 'regex:/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/'];
        } else {
            $rules['value'] = ['sometimes', 'string'];
        }

        return $rules;
    }
}
