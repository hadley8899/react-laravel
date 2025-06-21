<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteCompanySetupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Basic Info
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9-]+$/',
                Rule::unique('companies', 'slug')->ignore($this->route('company')->id ?? null),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('companies', 'email')->ignore($this->route('company')->id ?? null),
            ],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'max:10000'], // 10MB

            // Contact
            'address' => ['nullable', 'string'],
            'billing_address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:64'],

            // Business
            'tax_id' => ['nullable', 'string', 'max:64'],
            'registration_number' => ['nullable', 'string', 'max:64'],
            'industry' => ['nullable', 'string', 'max:128'],
            'country' => ['nullable', 'string', 'max:64'],
            'status' => ['required', 'string', 'in:Active,Inactive,Pending'],
            'currency' => ['nullable', 'string', 'max:3'],

            // Preferences
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:8'],
            'default_units' => ['nullable', 'string', 'max:64'],
            'notes' => ['nullable', 'string'],

            // Appointment Settings
            'default_appointment_duration' => ['required', 'integer', Rule::in([30, 45, 60, 90, 120])],
            'enable_online_booking' => ['required', 'boolean'],
            'send_appointment_reminders' => ['required', 'boolean'],
            'appointment_reminder_timing' => [
                Rule::requiredIf($this->input('send_appointment_reminders') == true),
                'nullable',
                'string',
                Rule::in(['1h', '3h', '12h', '24h', '48h'])
            ],
            'appointment_buffer_time' => ['required', 'integer', 'min:0', 'max:120'],
            'min_booking_notice_hours' => ['required', 'integer', 'min:0', 'max:168'],
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_reminder_timing.required_if' => 'Reminder timing is required when appointment reminders are enabled.',
            'slug.regex' => 'The slug may only contain letters, numbers, and dashes.',
        ];
    }
}

