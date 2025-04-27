<?php

namespace App\Http\Requests;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vehicleId = $this->route('vehicle')->id ?? null;

        return [
            'customer_id' => [
                'required',
                'exists:customers,uuid',
                // ensure the customer belongs to the same company
                function ($attr, $value, $fail) {
                    $sameCompany = Customer::query()
                        ->where('uuid', $value)
                        ->where('company_id', auth()->user()->company_id)
                        ->exists();
                    if (!$sameCompany) {
                        $fail('Customer does not belong to your company.');
                    }
                },
            ],
            'make' => ['sometimes', 'required', 'string', 'max:100'],
            'model' => ['sometimes', 'required', 'string', 'max:100'],
            'year' => ['sometimes', 'nullable', 'digits:4', 'integer', 'min:1900', 'max:' . date('Y')],
            'registration' => [
                'sometimes', 'required', 'string', 'max:20',
                Rule::unique('vehicles', 'registration')
                    ->where('company_id', auth()->user()->company_id)
                    ->ignore($vehicleId),
            ],
            'last_service' => ['sometimes', 'nullable', 'date'],
            'next_service_due' => ['sometimes', 'nullable', 'date', 'after_or_equal:last_service'],
            'type' => ['sometimes', 'nullable', 'string', 'max:50'],
        ];
    }
}
