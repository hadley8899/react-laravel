<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Customer;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleMake;
use App\Models\VehicleModel;
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

        $this->command->info('Seeding the customers table...');
        // 1) companies + customers
        $this->call(CustomerSeeder::class);

        $this->command->info('Seeding the make and model data...');
        $this->call([VehicleMakeModelSeeder::class]);

        $this->command->info('Seeding the vehicles...');
        // 2) each customer gets 0‑20 vehicles
        Customer::all()->each(function ($customer) {
            $vehicleCount = random_int(0, 20);

            for ($i = 0; $i < $vehicleCount; $i++) {
                // Get a random make
                $make = VehicleMake::query()->inRandomOrder()->first();

                if ($make) {
                    // Get a random model belonging to this make
                    $model = VehicleModel::query()
                        ->where('vehicle_make_id', $make->id)
                        ->inRandomOrder()
                        ->first();

                    if ($model) {
                        Vehicle::factory()->create([
                            'company_id' => $customer->company_id,
                            'customer_id' => $customer->id,
                            'make' => $make->name,
                            'model' => $model->name,
                        ]);
                    }
                }
            }
        });

        $this->command->info('Seeding the users table...');
        // 3) users
        $roles = ['Admin', 'Manager', 'User']; // Super admin is excluded from random assignment
        $this->command->info('Roles available: ' . implode(', ', $roles));
        User::factory(100)->create()->each(function ($user) use ($roles) {
            $user->company_id = Company::query()->inRandomOrder()->value('id');
            $user->save();

            $randomRole = $roles[array_rand($roles)];
            $user->assignRole($randomRole);
        });

        $this->command->info('creating the test super admin user...');

        // Create a fixed test user on company 1
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'company_id' => 1,
        ]);
        $testUser->assignRole('Super Admin');

        // Create a test admin user on company 1
        $testAdmin = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'test-admin@example.com',
            'company_id' => 1,
        ]);
        $testAdmin->assignRole('Admin');

        // Create a test manager user on company 1
        $testManager = User::factory()->create([
            'name' => 'Test Manager',
            'email' => 'test-manager@example.com',
            'company_id' => 1,
        ]);
        $testManager->assignRole('Manager');

        // Create a test user on company 1
        $testUser2 = User::factory()->create([
            'name' => 'Test User 2',
            'email' => 'test-user@example.com',
            'company_id' => 1,
        ]);
        $testUser2->assignRole('User');

        $this->command->info('Created test users: ' . $testUser->email . ', ' . $testAdmin->email . ', ' . $testManager->email . ', ' . $testUser2->email);

        $this->command->info('Seeding the appointments and invoices...');
        $this->call([InvoiceSeeder::class, AppointmentSeeder::class]);
    }
}
