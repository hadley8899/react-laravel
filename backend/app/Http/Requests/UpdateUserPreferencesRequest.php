<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserPreferencesRequest extends FormRequest
{
    /**
     * Determine if the user is authorised to make this request.
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
            'notify_new_booking' => ['sometimes', 'boolean'],
            'notify_job_complete' => ['sometimes', 'boolean'],
            'preferred_theme' => ['sometimes', 'in:light,dark,system'],
        ];
    }
}
