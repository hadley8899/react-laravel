<?php

namespace App\Http\Requests\Media;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDirectoryRequest extends FormRequest
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
        $uuid = $this->route('uuid');
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'parent_uuid' => [
                'sometimes',
                'nullable',
                'uuid',
                Rule::notIn([$uuid]),
            ],
        ];
    }
}
