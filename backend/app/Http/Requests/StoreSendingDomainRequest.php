<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSendingDomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'domain' => [
                'required',
                'string',
                'max:255',
                'regex:/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i',
                // unique per company:
                function ($attr, $value, $fail) {
                    if ($this->user()->company
                        ->sendingDomains()
                        ->where('domain', $value)
                        ->exists()) {
                        $fail('Domain already exists.');
                    }
                },
            ],
        ];
    }
}
