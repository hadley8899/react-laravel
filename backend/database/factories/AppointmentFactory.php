<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Company;
use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        $company = Company::query()->inRandomOrder()->first() ?? Company::factory();
        $customer = Customer::factory()->for($company);
        $vehicle = Vehicle::factory()->for($company)->for($customer);

        $serviceTypes = ['MOT', 'Service', 'Repair', 'Tire Change', 'Diagnostic', 'Check-up'];
        $statuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

        return [
            'uuid' => $this->faker->uuid,
            'company_id' => $company,
            'customer_id' => $customer,
            'vehicle_id' => $vehicle,
            'service_type' => $this->faker->randomElement($serviceTypes),
            'date_time' => $this->faker->dateTimeBetween('now', '+30 days'),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'status' => $this->faker->randomElement($statuses),
            'mechanic_assigned' => $this->faker->boolean(70) ? $this->faker->name : null,
            'notes' => $this->faker->boolean(40) ? $this->faker->sentence : null,
        ];
    }
}
