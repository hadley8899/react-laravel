<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),   // overwritten in seeder
            'customer_id' => Customer::factory(),  // overwritten in seeder
            'make' => $this->faker->randomElement(['Ford', 'BMW', 'Toyota', 'Mercedes', 'Vauxhall']),
            'model' => $this->faker->word,
            'year' => $this->faker->numberBetween(2000, 2024),
            'registration' => strtoupper($this->faker->bothify('??## ???')),
            'last_service' => $this->faker->dateTimeBetween('-1 year', '-1 month'),
            'next_service_due' => $this->faker->dateTimeBetween('now', '+1 year'),
            'type' => $this->faker->randomElement(['Car', 'Van', 'Truck']),
        ];
    }
}
