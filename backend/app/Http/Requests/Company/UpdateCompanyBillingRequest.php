<?php

namespace App\Http\Requests\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyBillingRequest extends FormRequest
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
            'invoice_prefix' => ['string', 'max:32'],
            'default_payment_terms' => ['in:DueOnReceipt,Net7,Net15,Net30'],
            'invoice_footer_notes' => ['nullable', 'string'],
        ];
    }
}
