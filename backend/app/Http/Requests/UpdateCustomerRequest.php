<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
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
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:customers,email,' . $this->route('customer')->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:Active,Inactive',
            'total_spent' => 'sometimes|required|numeric|min:0',
            'avatar_url' => 'nullable|url',
        ];
    }
}
