<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $emailVerifiedAt = now();
        if (fake()->boolean(20)) {
            // 20% chance of having an unverified email
            $emailVerifiedAt = null;
        }

        // Random status
        $status = fake()->randomElement(['active', 'pending', 'invited', 'rejected']);

        if ($status === 'invited') {
            // If the status is 'invited', set email_verified_at to null
            $emailVerifiedAt = null;
            $inviteToken = User::createInvitationToken();
        }

        $preferredTheme = fake()->randomElement(['light', 'dark', 'system']);

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'company_id' => Company::factory(),
            'avatar_path' => null,
            'status' => $status,
            'invitation_token' => $inviteToken ?? null,
            'preferred_theme' => $preferredTheme,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
