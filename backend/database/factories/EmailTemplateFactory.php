<?php

namespace Database\Factories;

use App\Models\{Company, EmailTemplate, User, EmailSectionTemplate};
use Illuminate\Database\Eloquent\Factories\Factory;
use Random\RandomException;

class EmailTemplateFactory extends Factory
{
    protected $model = EmailTemplate::class;

    /**
     * @throws RandomException
     */
    public function definition(): array
    {
        $faker = $this->faker;

        // pick an existing company (the seeder creates them first)
        $company = Company::query()->inRandomOrder()->first()
            ?? Company::factory()->create();

        // pick / create a user inside that company
        $creator = User::query()->where('company_id', $company->id)->inRandomOrder()->first()
            ?? User::factory()->create(['company_id' => $company->id]);

        // Get all available section templates
        $sectionTemplates = EmailSectionTemplate::all()->keyBy('type');

        // Helper to generate content for a given section type
        $makeSection = function ($type) use ($faker, $sectionTemplates) {
            switch ($type) {
                case 'header':
                    return [
                        'type' => 'header',
                        'content' => [
                            'heading' => $faker->catchPhrase,
                            'subheading' => $faker->sentence(),
                            'backgroundColor' => $faker->hexColor,
                            'textColor' => '#ffffff',
                        ],
                    ];
                case 'footer':
                    return [
                        'type' => 'footer',
                        'content' => [
                            'companyName' => $faker->company,
                            'address' => $faker->address,
                            'unsubscribeText' => 'Unsubscribe',
                            'backgroundColor' => $faker->hexColor,
                            'textColor' => '#666666',
                        ],
                    ];
                case 'text':
                    return [
                        'type' => 'text',
                        'content' => [
                            'text' => $faker->paragraph(),
                            'fontSize' => $faker->randomElement(['14px', '16px', '18px']),
                            'textAlign' => $faker->randomElement(['left', 'center', 'right']),
                        ],
                    ];
                case 'two_col_text':
                    return [
                        'type' => 'two_col_text',
                        'content' => [
                            'columns' => [
                                ['text' => $faker->sentence(8)],
                                ['text' => $faker->sentence(8)],
                            ],
                        ],
                    ];
                case 'three_col_text':
                    return [
                        'type' => 'three_col_text',
                        'content' => [
                            'columns' => [
                                ['text' => $faker->sentence()],
                                ['text' => $faker->sentence()],
                                ['text' => $faker->sentence()],
                            ],
                        ],
                    ];
                case 'text_image_top':
                    return [
                        'type' => 'text_image_top',
                        'content' => [
                            'image' => $faker->imageUrl(600, 200, 'business'),
                            'text' => $faker->paragraph(2),
                        ],
                    ];
                case 'text_left_image_right':
                    return [
                        'type' => 'text_left_image_right',
                        'content' => [
                            'left' => ['text' => $faker->paragraph(2)],
                            'right' => ['image' => $faker->imageUrl(300, 200, 'business')],
                        ],
                    ];
                case 'image_left_text_right':
                    return [
                        'type' => 'image_left_text_right',
                        'content' => [
                            'left' => ['image' => $faker->imageUrl(300, 200, 'business')],
                            'right' => ['text' => $faker->paragraph(2)],
                        ],
                    ];
                case 'button':
                    return [
                        'type' => 'button',
                        'content' => [
                            'text' => $faker->words(2, true),
                            'url' => $faker->url,
                            'backgroundColor' => $faker->hexColor,
                            'textColor' => '#ffffff',
                            'alignment' => $faker->randomElement(['left', 'center', 'right']),
                        ],
                    ];
                case 'two_buttons':
                    return [
                        'type' => 'two_buttons',
                        'content' => [
                            'buttons' => [
                                [
                                    'text' => $faker->word,
                                    'url' => $faker->url,
                                    'backgroundColor' => $faker->hexColor,
                                    'textColor' => '#ffffff',
                                ],
                                [
                                    'text' => $faker->word,
                                    'url' => $faker->url,
                                    'backgroundColor' => $faker->hexColor,
                                    'textColor' => '#ffffff',
                                ],
                            ],
                            'alignment' => $faker->randomElement(['left', 'center', 'right']),
                        ],
                    ];
                case 'three_buttons':
                    return [
                        'type' => 'three_buttons',
                        'content' => [
                            'buttons' => [
                                [
                                    'text' => $faker->word,
                                    'url' => $faker->url,
                                    'backgroundColor' => $faker->hexColor,
                                    'textColor' => '#ffffff',
                                ],
                                [
                                    'text' => $faker->word,
                                    'url' => $faker->url,
                                    'backgroundColor' => $faker->hexColor,
                                    'textColor' => '#ffffff',
                                ],
                                [
                                    'text' => $faker->word,
                                    'url' => $faker->url,
                                    'backgroundColor' => $faker->hexColor,
                                    'textColor' => '#ffffff',
                                ],
                            ],
                            'alignment' => $faker->randomElement(['left', 'center', 'right']),
                        ],
                    ];
                case 'image':
                    return [
                        'type' => 'image',
                        'content' => [
                            'src' => $faker->imageUrl(600, 400, 'business'),
                            'alt' => $faker->words(3, true),
                            'width' => '600px',
                            'caption' => $faker->boolean ? $faker->sentence : '',
                        ],
                    ];
                case 'two_images':
                    return [
                        'type' => 'two_images',
                        'content' => [
                            'images' => [
                                [
                                    'src' => $faker->imageUrl(300, 200, 'business'),
                                    'alt' => $faker->words(2, true),
                                ],
                                [
                                    'src' => $faker->imageUrl(300, 200, 'business'),
                                    'alt' => $faker->words(2, true),
                                ],
                            ],
                        ],
                    ];
                case 'product':
                    return [
                        'type' => 'product',
                        'content' => [
                            'image' => $faker->imageUrl(200, 200, 'technics'),
                            'title' => $faker->words(3, true),
                            'desc' => $faker->sentence(10),
                            'price' => '$' . $faker->randomFloat(2, 10, 200),
                            'button' => [
                                'text' => 'Buy Now',
                                'url' => $faker->url,
                                'backgroundColor' => $faker->hexColor,
                                'textColor' => '#ffffff',
                            ],
                        ],
                    ];
                case 'two_products':
                    return [
                        'type' => 'two_products',
                        'content' => [
                            'products' => [
                                [
                                    'image' => $faker->imageUrl(200, 200, 'technics'),
                                    'title' => $faker->words(2, true),
                                    'desc' => $faker->sentence(8),
                                    'price' => '$' . $faker->randomFloat(2, 10, 200),
                                ],
                                [
                                    'image' => $faker->imageUrl(200, 200, 'technics'),
                                    'title' => $faker->words(2, true),
                                    'desc' => $faker->sentence(8),
                                    'price' => '$' . $faker->randomFloat(2, 10, 200),
                                ],
                            ],
                        ],
                    ];
                case 'social':
                    return [
                        'type' => 'social',
                        'content' => [
                            'iconSize' => '24',
                            'iconColor' => $faker->hexColor,
                            'facebook' => 'https://facebook.com/' . $faker->userName,
                            'instagram' => 'https://instagram.com/' . $faker->userName,
                            'x' => 'https://x.com/' . $faker->userName,
                            'linkedin' => 'https://linkedin.com/in/' . $faker->userName,
                        ],
                    ];
                case 'video':
                    return [
                        'type' => 'video',
                        'content' => [
                            'url' => 'https://www.youtube.com/watch?v=' . $faker->regexify('[A-Za-z0-9_-]{11}'),
                            'caption' => $faker->boolean ? $faker->sentence : '',
                        ],
                    ];
                case 'divider':
                    return [
                        'type' => 'divider',
                        'content' => [
                            'height' => $faker->randomElement(['1px', '2px', '3px']),
                            'color' => $faker->hexColor,
                        ],
                    ];
                case 'spacer':
                    return [
                        'type' => 'spacer',
                        'content' => [
                            'height' => $faker->randomElement(['16px', '24px', '32px']),
                        ],
                    ];
                case 'quote':
                    return [
                        'type' => 'quote',
                        'content' => [
                            'text' => '“' . $faker->sentence(10) . '”',
                            'author' => $faker->name,
                            'backgroundColor' => $faker->hexColor,
                            'textColor' => '#333333',
                        ],
                    ];
                case 'two_column':
                    return [
                        'type' => 'two_column',
                        'content' => [
                            'layout' => $faker->randomElement(['image_left', 'image_right']),
                            'image' => $faker->imageUrl(300, 200, 'business'),
                            'alt' => $faker->words(2, true),
                            'heading' => $faker->words(3, true),
                            'body' => $faker->sentence(12),
                            'button' => [
                                'text' => $faker->words(2, true),
                                'url' => $faker->url,
                                'backgroundColor' => $faker->hexColor,
                                'textColor' => '#ffffff',
                            ],
                        ],
                    ];
                default:
                    // fallback: use the default_content from the section template if available
                    if (isset($sectionTemplates[$type])) {
                        return [
                            'type' => $type,
                            'content' => $sectionTemplates[$type]->default_content,
                        ];
                    }
                    return null;
            }
        };

        // Pick a random layout: always header, 1-4 random sections, always footer
        $availableTypes = $sectionTemplates->keys()->all();
        $middleTypes = collect($availableTypes)
            ->reject(fn($t) => in_array($t, ['header', 'footer']))
            ->values()
            ->all();

        $layout = [
            $makeSection('header'),
        ];

        foreach (range(1, random_int(1, 4)) as $ignored) {
            $type = $faker->randomElement($middleTypes);
            $section = $makeSection($type);
            if ($section) {
                $layout[] = $section;
            }
        }

        $layout[] = $makeSection('footer');

        return [
            'company_id' => $company->id,
            'name' => ucwords($faker->words(3, true)) . ' Template',
            'subject' => $faker->sentence,
            'preview_text' => $faker->sentence(5),
            'layout_json' => $layout,
            'html_cached' => null,
            'text_cached' => null,
            'created_by' => $creator->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
