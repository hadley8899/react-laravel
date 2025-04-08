<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Customer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random image ID for pravatar (they have about 70 unique images)
        $pravatarId = $this->faker->numberBetween(1, 70);

        return [
            'uuid' => (string) Str::uuid(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'status' => $this->faker->randomElement(['Active', 'Inactive']),
            'total_spent' => $this->faker->randomFloat(2, 0, 10000),
            // Construct the Pravatar URL manually
            'avatar_url' => "https://i.pravatar.cc/150?img={$pravatarId}", // Using 150x150 size
            'company_id' => Company::factory(),
        ];
    }
}
