<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Company;
use App\Models\Customer;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleMake;
use Exception;
use Illuminate\Database\Seeder;
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

        $this->command->info('Seeding the make and model data...');
        $this->call([VehicleMakeModelSeeder::class]);

        // Makes and models
        $makesWithModels = VehicleMake::query()->with('models')->get();

        Company::all()->each(function ($company) use ($makesWithModels) {
            User::factory(random_int(5, 100))->create([
                'company_id' => $company->id
            ])->each(function ($user) use ($company) {
                $roles = ['Admin', 'Manager', 'User'];
                // $user->company_id = $company->id; // No longer needed
                // $user->save(); // No longer needed

                $randomRole = $roles[array_rand($roles)];
                $this->command->info('Assigning role ' . $randomRole . ' to user ' . $user->email . ' in company ' . $company->name);
                $user->assignRole($randomRole);
            });

            Customer::factory(random_int(100, 1000))->create([
                'company_id' => $company->id
            ])->each(function ($customer) use ($company, $makesWithModels) {
                $this->command->info('Creating customer ' . $customer->name . ' for company ' . $company->name);
                $vehicleCount = random_int(1, 25);
                for ($i = 0; $i < $vehicleCount; $i++) {
                    // Get a random make from the preloaded makes
                    $make = $makesWithModels->random();
                    // Get a random model from the make
                    $model = $make->models->random();

                    $this->command->info('Creating vehicle ' . $model->name . ' for company ' . $company->name);

                    // Sometimes this can hit a unique constraint error if the same make and model is chosen
                    try {
                        Vehicle::factory()->create([
                            'company_id' => $customer->company_id,
                            'customer_id' => $customer->id,
                            'make' => $make->name,
                            'model' => $model->name,
                        ]);

                        Appointment::factory()->create([
                            'company_id' => $customer->company_id,
                            'customer_id' => $customer->id,
                            'vehicle_id' => Vehicle::latest()->first()->id, // Get the last created vehicle
                        ]);

                    } catch (Exception $e) {
                        $this->command->error('Error creating vehicle: ' . $e->getMessage());
                    }
                }
            });
        });

        $this->command->info('Seeding the appointments and invoices...');
        $this->call([InvoiceSeeder::class]);
    }
}
