<?php

namespace App\Http\Requests;

use App\Actions\Fortify\PasswordValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    use PasswordValidationRules;

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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'company_code' => ['string', 'sometimes', 'exists:companies,company_code'],
            'cf_turnstile_response' => ['required', 'string'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!$this->passesTurnstile()) {
                $validator->errors()->add('captcha', 'Turnstile verification failed.');
            }
        });
    }

    /**
     * @throws ConnectionException
     */
    private function passesTurnstile(): bool
    {
        $response = Http::post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            [
                'secret'   => config('services.turnstile.secret'),
                'response' => $this->cf_turnstile_response,
                'remoteip' => $this->ip(),
            ]
        );

        return (bool) ($response->json()['success'] ?? false);
    }
}
