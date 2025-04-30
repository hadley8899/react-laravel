<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
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
     * @return array<string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string'],
            'billing_address' => ['sometimes', 'nullable', 'string'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:64'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:companies,email,' . $this->route('company')->id],
            'website' => ['sometimes', 'nullable', 'url', 'max:255'],
            'logo' => ['sometimes', 'image', 'max:2048'],
            'tax_id' => ['sometimes', 'nullable', 'string', 'max:64'],
            'registration_number' => ['sometimes', 'nullable', 'string', 'max:64'],
            'industry' => ['sometimes', 'nullable', 'string', 'max:128'],
            'country' => ['sometimes', 'nullable', 'string', 'max:64'],
            'status' => ['sometimes', 'nullable', 'string', 'in:Active,Inactive,Pending'],
            'currency' => ['sometimes', 'nullable', 'string', 'max:3'],
            'plan' => ['sometimes', 'nullable', 'string', 'in:Free,Pro,Enterprise'],
            'trial_ends_at' => ['sometimes', 'nullable', 'date'],
            'active_until' => ['sometimes', 'nullable', 'date'],
            'timezone' => ['sometimes', 'nullable', 'string', 'max:64'],
            'locale' => ['sometimes', 'nullable', 'string', 'max:8'],
            'default_units' => ['sometimes', 'nullable', 'string', 'max:64'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', 'regex:/^[A-Za-z0-9-]+$/'],
        ];
    }
}
