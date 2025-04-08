<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed companies and their associated customers
        // $this->call(CompanySeeder::class);
        $this->call(CustomerSeeder::class);

        // Seed users and associate them with companies
        User::factory(12)->create()->each(function ($user) {
            $user->company_id = Company::query()->inRandomOrder()->first()->id;
            $user->save();
        });

        // Create a specific test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'company_id' => Company::query()->inRandomOrder()->first()->id,
        ]);
    }
}
