<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TagFactory extends Factory
{
    public function definition(): array
    {
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

        $randomTag = $this->faker->randomElement($exampleTags);

        return [
            'company_id' => Company::factory(),
            'name' => $randomTag,
            'color' => $this->faker->boolean(60)
                ? $this->faker->safeHexColor()  // #a3e635
                : null,
        ];
    }
}
