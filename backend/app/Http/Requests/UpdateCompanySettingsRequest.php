<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateCompanySettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ensure the authenticated user belongs to the company they are trying to update
        $company = $this->route('company'); // Get company from route model binding
        return Auth::check() && Auth::user()->company_id === $company->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'default_appointment_duration' => ['required', 'integer', Rule::in([30, 45, 60, 90, 120])],
            'enable_online_booking' => ['required', 'boolean'],
            'send_appointment_reminders' => ['required', 'boolean'],
            'appointment_reminder_timing' => [
                Rule::requiredIf($this->input('send_appointment_reminders') == true), // Required only if sending reminders
                'nullable', // Allow null if send_reminders is false
                'string',
                Rule::in(['1h', '3h', '12h', '24h', '48h'])
            ],
            // Optional fields
            'appointment_buffer_time' => ['required', 'integer', 'min:0', 'max:120'], // E.g., 0 to 2 hours buffer
            'min_booking_notice_hours' => ['required', 'integer', 'min:0', 'max:168'], // E.g., 0 to 1 week notice
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_reminder_timing.required_if' => 'Reminder timing is required when appointment reminders are enabled.',
        ];
    }
}
