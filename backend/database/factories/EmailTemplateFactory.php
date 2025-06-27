<?php

namespace Database\Factories;

use App\Models\{Company, EmailTemplate, User};
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailTemplateFactory extends Factory
{
    protected $model = EmailTemplate::class;

    public function definition(): array
    {
        // pick an existing company (the seeder creates them first)
        $company = Company::inRandomOrder()->first()
            ?? Company::factory()->create();

        // pick / create a user inside that company
        $creator = User::where('company_id', $company->id)->inRandomOrder()->first()
            ?? User::factory()->create(['company_id' => $company->id]);

        // super-simple 3-section layout so the editor can render it immediately
        $layout = [
            [
                'type'    => 'HEADER',
                'content' => [
                    'heading'         => $this->faker->sentence(3),
                    'subheading'      => $this->faker->sentence(6),
                    'backgroundColor' => '#1976d2',
                    'textColor'       => '#ffffff',
                ],
            ],
            [
                'type'    => 'TEXT',
                'content' => [
                    'text'      => $this->faker->paragraph(3),
                    'fontSize'  => '16px',
                    'textAlign' => 'left',
                ],
            ],
            [
                'type'    => 'FOOTER',
                'content' => [
                    'companyName'     => '{{company.name}}',
                    'address'         => '{{company.address}}',
                    'unsubscribeText' => 'Unsubscribe',
                    'backgroundColor' => '#f5f5f5',
                    'textColor'       => '#666666',
                ],
            ],
        ];

        return [
            'company_id'   => $company->id,
            'name'         => ucwords($this->faker->words(3, true)) . ' Template',
            'subject'      => $this->faker->sentence,
            'preview_text' => $this->faker->sentence(5),
            'layout_json'  => $layout,
            'html_cached'  => null,
            'text_cached'  => null,
            'created_by'   => $creator->id,
            'created_at'   => now(),
            'updated_at'   => now(),
        ];
    }
}
