<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Company;
use App\Models\Customer;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleMake;
use Carbon\Carbon;
use Exception;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Random\RandomException;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * @throws RandomException
     */
    public function run(): void
    {
        $this->command->info('Seeding the permissions and roles...');
        // Create permissions and roles first
        $this->call(PermissionSeeder::class);

        // Create a bunch of companies
        $this->command->info('Seeding the companies');
        Company::factory()->count(10)->create();

        $this->createdFixedUsers();

        $this->command->info('Seeding the make and model data...');
        $this->call([VehicleMakeModelSeeder::class]);

        // Makes and models
        $makesWithModels = VehicleMake::query()->with('models')->get();

        $this->command->info('Seeding the company tags...');
        $this->call(TagSeeder::class);

        Company::all()->each(function ($company) use ($makesWithModels) {
            $this->createCompanyData($company, $makesWithModels);
        });

        $this->command->info('Seeding the appointments and invoices...');
        $this->call([InvoiceSeeder::class]);
    }

    private function createdFixedUsers(): void
    {
        $this->command->info('creating the test super admin user...');
        // Create a fixed test user on company 1
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'company_id' => 1,
            'status' => 'active',
        ]);
        $testUser->assignRole('Super Admin');

        // Create a test admin user on company 1
        $testAdmin = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'test-admin@example.com',
            'company_id' => 1,
            'status' => 'active',
        ]);
        $testAdmin->assignRole('Admin');

        // Create a test manager user on company 1
        $testManager = User::factory()->create([
            'name' => 'Test Manager',
            'email' => 'test-manager@example.com',
            'company_id' => 1,
            'status' => 'active',
        ]);
        $testManager->assignRole('Manager');

        // Create a test user on company 1
        $testUser2 = User::factory()->create([
            'name' => 'Test User 2',
            'email' => 'test-user@example.com',
            'company_id' => 1,
            'status' => 'active',
        ]);
        $testUser2->assignRole('User');
        $this->command->info('Created test users: ' . $testUser->email . ', ' . $testAdmin->email . ', ' . $testManager->email . ', ' . $testUser2->email);
    }

    /**
     * @param $customer
     * @param $company
     * @param Collection $makesWithModels
     * @return void
     * @throws RandomException
     */
    private function createVehiclesAndAppointments($customer, $company, Collection $makesWithModels): void
    {
        $this->command->info('Creating customer ' . $customer->name . ' for company ' . $company->name);
        $vehicleCount = random_int(1, 25);
        $vehicles = [];
        $faker = Faker::create();
        for ($i = 0; $i < $vehicleCount; $i++) {
            // Get a random make from the preloaded makes
            $make = $makesWithModels->random();
            // Get a random model from the make
            $vehicleModel = $make->models->random();

            $vehicles[] = [
                'uuid' => (string)Str::uuid(),
                'company_id' => $customer->company_id,
                'customer_id' => $customer->id,
                'make' => $make->name,
                'model' => $vehicleModel->name,
                'year' => random_int(1991, date('Y')),
                'registration' => strtoupper($faker->bothify('??## ???')),
                'last_service' => $faker->dateTimeBetween('-1 year', '-1 month'),
                'next_service_due' => $faker->dateTimeBetween('now', '+1 year'),
                'type' => $faker->randomElement(['Car', 'Van', 'Truck']),
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString(),
            ];
        }

        $this->command->info('Creating ' . count($vehicles) . ' vehicles for customer ' . $customer->name);
        Vehicle::query()->insert($vehicles);
        $newVehicles = Vehicle::query()->where('company_id', $company->id)
            ->where('customer_id', $customer->id)
            ->get();

        $appointments = [];
        foreach ($newVehicles as $vehicle) {
            $appointments[] = [
                'uuid' => (string)Str::uuid(),
                'company_id' => $customer->company_id,
                'customer_id' => $customer->id,
                'vehicle_id' => $vehicle->id,
                'service_type' => $faker->randomElement(['MOT', 'Service', 'Repair', 'Tire Change', 'Diagnostic', 'Check-up']),
                'date_time' => $faker->dateTimeBetween('now', '+30 days'),
                'duration_minutes' => $faker->randomElement([30, 45, 60, 90]),
                'status' => $faker->randomElement(['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show']),
                'mechanic_assigned' => $faker->boolean(70) ? $faker->name : null,
                'notes' => $faker->boolean(40) ? $faker->sentence : null,
            ];
        }
        Appointment::query()->insert($appointments);
    }

    /**
     * @param $company
     * @param Collection $makesWithModels
     * @return void
     * @throws RandomException
     */
    private function createCompanyData($company, Collection $makesWithModels): void
    {
        try {
            User::factory(random_int(5, 100))->create([
                'company_id' => $company->id,
            ])->each(function ($user) use ($company) {
                $roles = ['Admin', 'Manager', 'User'];
                $randomRole = $roles[array_rand($roles)];
                $this->command->info('Assigning role ' . $randomRole . ' to user ' . $user->email . ' in company ' . $company->name);
                $user->assignRole($randomRole);
            });

            Customer::factory(random_int(100, 1000))->create([
                'company_id' => $company->id,
            ])->each(function ($customer) use ($company, $makesWithModels) {
                $this->createVehiclesAndAppointments($customer, $company, $makesWithModels);
            });

            // Update company 1 to be active so we can login with our test users
            $numberOneCompany = Company::query()->where('id', 1)->first();
            if ($numberOneCompany) {
                $numberOneCompany->status = 'Active';
                $numberOneCompany->save();
                $this->command->info('Updated company 1 to active status.');
            } else {
                $this->command->error('Company 1 not found, cannot update status.');
            }
        } catch (Exception) {

        }
    }
}
