<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateAppointmentRequest extends FormRequest
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
     * @return array
     */
    public function rules(): array
    {
        return [
            'customer_uuid' => ['required', 'uuid',
                Rule::exists('customers', 'uuid')
                    ->where('company_id', Auth::user()->company->id),
            ],
            'vehicle_uuid' => ['required', 'uuid',
                Rule::exists('vehicles', 'uuid')
                    ->where('company_id', Auth::user()->company->id),
            ],
            'service_type' => ['required', Rule::in([
                'MOT', 'Service', 'Repair', 'Tire Change', 'Diagnostic', 'Check-up',
            ])],
            'date_time' => ['required', 'date', 'after_or_equal:now'],
            'duration_minutes' => ['required', 'integer', 'min:15'],
            'status' => ['required', Rule::in([
                'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show',
            ])],
            'mechanic_assigned' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
