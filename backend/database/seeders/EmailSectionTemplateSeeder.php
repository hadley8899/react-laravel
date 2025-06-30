<?php

namespace Database\Seeders;

use App\Models\EmailSectionTemplate;
use Illuminate\Database\Seeder;

class EmailSectionTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            [
                'type' => 'header',
                'title' => 'Header Section',
                'default_content' => [
                    'heading' => 'Welcome to Our Newsletter',
                    'subheading' => 'Stay updated with our latest news',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                ],
            ],
            [
                'type' => 'text',
                'title' => 'Text Section',
                'default_content' => [
                    'text' => 'Add your text content here. You can include paragraphs, quotes, and formatted text.',
                    'fontSize' => '16px',
                    'textAlign' => 'left',
                ],
            ],
            [
                'type' => 'image',
                'title' => 'Image Section',
                'default_content' => [
                    'src' => 'https://placehold.co/600x400?text=Hello+World',
                    'alt' => 'Placeholder image',
                    'width' => '100%',
                    'caption' => '',
                ],
            ],
            [
                'type' => 'button',
                'title' => 'Button Section',
                'default_content' => [
                    'text' => 'Call to Action',
                    'url' => '#',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                    'alignment' => 'center',
                ],
            ],
            [
                'type' => 'list',
                'title' => 'List Section',
                'default_content' => [
                    'items' => ['First item', 'Second item', 'Third item'],
                    'listType' => 'bullet',
                ],
            ],
            [
                'type' => 'footer',
                'title' => 'Footer Section',
                'default_content' => [
                    'companyName' => '{{COMPANY_NAME}}',
                    'address' => '{{COMPANY_ADDRESS}}',
                    'unsubscribeText' => 'Unsubscribe from this list',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                ],
            ],
            [
                'type' => 'divider',
                'title' => 'Divider',
                'default_content' => [
                    'height' => '1px',
                    'color' => '{{PRIMARY_COLOR}}',
                ],
            ],
            [
                'type' => 'spacer',
                'title' => 'Spacer',
                'default_content' => [
                    'height' => '24px',
                ],
            ],
            [
                'type' => 'quote',
                'title' => 'Quote / Testimonial',
                'default_content' => [
                    'text' => '“Customer quote goes here.”',
                    'author' => 'Happy Client',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                ],
            ],
            [
                'type' => 'two_column',
                'title' => 'Two-Column (Image + Text)',
                'default_content' => [
                    'layout' => 'image_left', // or image_right
                    'image' => 'https://placehold.co/300x200',
                    'alt' => 'Placeholder image',
                    'heading' => 'Awesome Feature',
                    'body' => 'Short supporting copy explaining the feature.',
                    'button' => [
                        'text' => 'Learn More',
                        'url' => '#',
                        'backgroundColor' => '{{PRIMARY_COLOR}}',
                        'textColor' => '{{TEXT_COLOR}}',
                    ],
                ],
            ],
            [
                'type' => 'social',
                'title' => 'Social Links',
                'default_content' => [
                    'iconSize' => '24',
                    'iconColor' => '{{PRIMARY_COLOR}}',
                    'facebook' => '{{FACEBOOK_URL}}',
                    'instagram' => '{{INSTAGRAM_URL}}',
                    'x' => '{{X_URL}}',
                    'linkedin' => '{{LINKEDIN_URL}}',
                ],
            ],
        ];

        // idempotent upsert so seeder can run multiple times
        foreach ($defaults as $row) {
            EmailSectionTemplate::query()
                ->updateOrCreate(['type' => $row['type']], $row);
        }
    }
}
