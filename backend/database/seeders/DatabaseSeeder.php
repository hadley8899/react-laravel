<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Customer;
use App\Models\User;
use App\Models\Vehicle;
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

        // 2) each customer gets 0‑3 vehicles
        Customer::all()->each(function ($customer) {
            Vehicle::factory(random_int(0, 3))->create([
                'company_id' => $customer->company_id,
                'customer_id' => $customer->id,
            ]);
        });

        // 3) users
        User::factory(12)->create()->each(function ($user) {
            $user->company_id = Company::query()->inRandomOrder()->value('id');
            $user->save();
        });

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'company_id' => Company::query()->inRandomOrder()->value('id'),
        ]);
    }
}
