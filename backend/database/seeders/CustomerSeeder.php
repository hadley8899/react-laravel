<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Company;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 100 companies with 10 customers each (original functionality)
        Company::factory()
            ->count(100)
            ->has(Customer::factory()->count(10), 'customers')
            ->create();

        // Add a few thousand customers to company ID 66
        $targetCompany = Company::find(44);

        if ($targetCompany) {
            // Create 2000 customers for company ID 66
            Customer::factory()
                ->count(2000)
                ->for($targetCompany)
                ->create();

            $this->command->info('Added 2000 customers to company ID 66');
        } else {
            $this->command->warn('Company ID 66 not found. No additional customers were created.');
        }
    }
}
