<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFromAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'local_part' => ['required', 'string', 'max:64', 'regex:/^[a-z0-9._%+-]+$/i'],
            'name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
