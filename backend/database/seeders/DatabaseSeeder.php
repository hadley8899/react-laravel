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
        // 1) companies + customers
        $this->call(CustomerSeeder::class);

        $this->call([VehicleMakeModelSeeder::class]);

        // 2) each customer gets 0‑3 vehicles
        Customer::all()->each(function ($customer) {
            $vehicleCount = random_int(0, 3);

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

        // 3) users
        User::factory(12)->create()->each(function ($user) {
            $user->company_id = Company::query()->inRandomOrder()->value('id');
            $user->save();
        });

        // Create a fixed test user on company 1
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'company_id' => 1,
        ]);

        $this->call([InvoiceSeeder::class, AppointmentSeeder::class]);
    }
}
