<?php

namespace App\Http\Requests;

use App\Models\Invoice;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateInvoiceRequest extends FormRequest
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
            'invoice_number' => ['sometimes', 'string', 'max:50'],
            'customer_uuid' => [
                'sometimes',
                'string',
                'max:50',
                Rule::exists('customers', 'uuid')->where(function ($query) {
                    return $query->where('company_id', Auth::user()->company->id);
                })
            ],
            'issue_date' => ['sometimes', 'date'],
            'due_date' => ['sometimes', 'date', 'after_or_equal:issue_date'],
            'tax_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', Rule::in(Invoice::validStatuses())],
            'notes' => ['sometimes', 'nullable', 'string'],

            // Items validation
            'items' => ['sometimes', 'array'],
            'items.*.uuid' => ['sometimes', 'string', 'uuid'],
            'items.*.description' => ['required_with:items', 'string', 'max:255'],
            'items.*.quantity' => ['required_with:items', 'numeric', 'min:0.01'],
            'items.*.unit' => ['sometimes', 'nullable', 'string', 'max:50'],
            'items.*.unit_price' => ['required_with:items', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'items.*.description' => 'item description',
            'items.*.quantity' => 'item quantity',
            'items.*.unit_price' => 'item unit price',
        ];
    }
}
