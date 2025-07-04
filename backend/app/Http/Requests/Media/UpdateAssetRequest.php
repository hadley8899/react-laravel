<?php

namespace App\Http\Requests\Media;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
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
            'alt' => ['sometimes', 'nullable', 'string', 'max:255'],
            'directory_uuid' => ['sometimes', 'nullable', 'uuid'],
        ];
    }
}
