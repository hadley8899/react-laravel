<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:companies,slug',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:companies,email',
            'website' => 'nullable|url',
            'status' => 'required|in:Active,Inactive,Pending',
        ];
    }
}
