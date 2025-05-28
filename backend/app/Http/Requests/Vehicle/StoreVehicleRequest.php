<?php

namespace App\Http\Requests\Vehicle;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
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
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . date('Y')],
            'registration' => [
                'required', 'string', 'max:20',
                Rule::unique('vehicles', 'registration')->where('company_id', auth()->user()->company_id)
            ],
            'last_service' => ['nullable', 'date'],
            'next_service_due' => ['nullable', 'date', 'after_or_equal:last_service'],
            'type' => ['nullable', 'string', 'max:50'],
        ];
    }
}
