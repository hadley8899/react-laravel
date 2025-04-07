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
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:companies,slug,' . $this->route('company')->id,
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'sometimes|required|email|unique:companies,email,' . $this->route('company')->id,
            'website' => 'nullable|url',
            'status' => 'sometimes|required|in:Active,Inactive,Pending',
        ];
    }
}
