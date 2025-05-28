<?php

namespace App\Http\Requests\Invoice;

use App\Models\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_uuid' => [
                'required',
                'uuid',
                Rule::exists('customers', 'uuid')->where(function ($query) {
                    return $query->where('company_id', Auth::user()->company_id);
                }),
            ],
            'invoice_number' => [
                'required',
                'string',
                'max:50',
                'unique:invoices,invoice_number,NULL,id,company_id,' . Auth::user()->company_id,
            ],
            'issue_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:issue_date'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', Rule::in(Invoice::validStatuses())],
            'notes' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit' => ['nullable', 'string', 'max:20'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
