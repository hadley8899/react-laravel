<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Tag;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        $exampleTags = [
            'VIP',
            'New Customer',
            'High Priority',
            'Follow Up',
            'Newsletter Subscriber',
            'Loyal Customer',
            'Inactive',
            'Prospect',
            'Referral',
            'Feedback Received',
        ];

        Company::all()->each(
            function ($company) use ($exampleTags, $faker) {
                foreach ($exampleTags as $exampleTag) {
                    Tag::query()->create([
                        'company_id' => $company->id,
                        'name' => $exampleTag,
                        'color' => $faker->boolean(60)
                            ? $faker->safeHexColor()  // #a3e635
                            : null,
                    ]);
                }
            });
    }
}
