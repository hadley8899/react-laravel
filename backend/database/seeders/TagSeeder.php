<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Random\RandomException;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        Company::all()->each(/**
         * @throws RandomException
         */ function ($company) {
            Tag::factory()
                ->count(random_int(6, 15))
                ->state(['company_id' => $company->id])
                ->create();
        });
    }
}
