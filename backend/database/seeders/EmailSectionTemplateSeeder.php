<?php

namespace Database\Seeders;

use App\Models\EmailSectionTemplate;
use Illuminate\Database\Seeder;

class EmailSectionTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // Basics
            [
                'type' => 'text',
                'title' => 'Text Block',
                'group' => 'Basics',
                'default_content' => [
                    'text' => 'Add your text content here.',
                    'fontSize' => '16px',
                    'textAlign' => 'left',
                ],
            ],
            [
                'type' => 'two_col_text',
                'title' => '2 Column Text',
                'group' => 'Basics',
                'default_content' => [
                    'columns' => [
                        ['text' => 'Left column text'],
                        ['text' => 'Right column text'],
                    ],
                ],
            ],
            [
                'type' => 'three_col_text',
                'title' => '3 Column Text',
                'group' => 'Basics',
                'default_content' => [
                    'columns' => [
                        ['text' => 'Column 1'],
                        ['text' => 'Column 2'],
                        ['text' => 'Column 3'],
                    ],
                ],
            ],
            [
                'type' => 'text_image_top',
                'title' => 'Text Block with Image Top',
                'group' => 'Basics',
                'default_content' => [
                    'image' => 'https://placehold.co/600x200',
                    'text' => 'Text below image',
                ],
            ],
            [
                'type' => 'text_left_image_right',
                'title' => 'Text Left, Image Right',
                'group' => 'Basics',
                'default_content' => [
                    'left' => ['text' => 'Text'],
                    'right' => ['image' => 'https://placehold.co/300x200'],
                ],
            ],
            [
                'type' => 'image_left_text_right',
                'title' => 'Image Left, Text Right',
                'group' => 'Basics',
                'default_content' => [
                    'left' => ['image' => 'https://placehold.co/300x200'],
                    'right' => ['text' => 'Text'],
                ],
            ],

            // Buttons
            [
                'type' => 'button',
                'title' => '1 Button',
                'group' => 'Buttons',
                'default_content' => [
                    'text' => 'Call to Action',
                    'url' => '#',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                    'alignment' => 'center',
                ],
            ],
            [
                'type' => 'two_buttons',
                'title' => '2 Buttons',
                'group' => 'Buttons',
                'default_content' => [
                    'buttons' => [
                        [
                            'text' => 'Button 1',
                            'url' => '#',
                            'backgroundColor' => '{{PRIMARY_COLOR}}',
                            'textColor' => '{{TEXT_COLOR}}',
                        ],
                        [
                            'text' => 'Button 2',
                            'url' => '#',
                            'backgroundColor' => '{{PRIMARY_COLOR}}',
                            'textColor' => '{{TEXT_COLOR}}',
                        ],
                    ],
                    'alignment' => 'center',
                ],
            ],
            [
                'type' => 'three_buttons',
                'title' => '3 Buttons',
                'group' => 'Buttons',
                'default_content' => [
                    'buttons' => [
                        [
                            'text' => 'Button 1',
                            'url' => '#',
                            'backgroundColor' => '{{PRIMARY_COLOR}}',
                            'textColor' => '{{TEXT_COLOR}}',
                        ],
                        [
                            'text' => 'Button 2',
                            'url' => '#',
                            'backgroundColor' => '{{PRIMARY_COLOR}}',
                            'textColor' => '{{TEXT_COLOR}}',
                        ],
                        [
                            'text' => 'Button 3',
                            'url' => '#',
                            'backgroundColor' => '{{PRIMARY_COLOR}}',
                            'textColor' => '{{TEXT_COLOR}}',
                        ],
                    ],
                    'alignment' => 'center',
                ],
            ],

            // Images
            [
                'type' => 'image',
                'title' => '1 Image',
                'group' => 'Images',
                'default_content' => [
                    'src' => 'https://placehold.co/600x400?text=Hello+World',
                    'alt' => 'Placeholder image',
                    'width' => '600px',
                    'caption' => '',
                ],
            ],
            [
                'type' => 'two_images',
                'title' => '2 Images',
                'group' => 'Images',
                'default_content' => [
                    'images' => [
                        [
                            'src' => 'https://placehold.co/300x200?text=Image+1',
                            'alt' => 'Image 1',
                        ],
                        [
                            'src' => 'https://placehold.co/300x200?text=Image+2',
                            'alt' => 'Image 2',
                        ],
                    ],
                ],
            ],

            // Products
            [
                'type' => 'product',
                'title' => 'Product Block',
                'group' => 'Products',
                'default_content' => [
                    'image' => 'https://placehold.co/200x200',
                    'title' => 'Product Title',
                    'desc' => 'Short product description.',
                    'price' => '$19.99',
                    'button' => [
                        'text' => 'Buy Now',
                        'url' => '#',
                        'backgroundColor' => '{{PRIMARY_COLOR}}',
                        'textColor' => '{{TEXT_COLOR}}',
                    ],
                ],
            ],
            [
                'type' => 'two_products',
                'title' => '2 Products',
                'group' => 'Products',
                'default_content' => [
                    'products' => [
                        [
                            'image' => 'https://placehold.co/200x200',
                            'title' => 'Product 1',
                            'desc' => 'Description 1',
                            'price' => '$9.99',
                        ],
                        [
                            'image' => 'https://placehold.co/200x200',
                            'title' => 'Product 2',
                            'desc' => 'Description 2',
                            'price' => '$14.99',
                        ],
                    ],
                ],
            ],

            // Social
            [
                'type' => 'social',
                'title' => 'Social Links',
                'group' => 'Social',
                'default_content' => [
                    'iconSize' => '24',
                    'iconColor' => '{{PRIMARY_COLOR}}',
                    'facebook' => '{{FACEBOOK_URL}}',
                    'instagram' => '{{INSTAGRAM_URL}}',
                    'x' => '{{X_URL}}',
                    'linkedin' => '{{LINKEDIN_URL}}',
                ],
            ],

            // Headers & Footers
            [
                'type' => 'header',
                'title' => 'Header Section',
                'group' => 'Headers',
                'default_content' => [
                    'heading' => 'Welcome to Our Newsletter',
                    'subheading' => 'Stay updated with our latest news',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                ],
            ],
            [
                'type' => 'footer',
                'title' => 'Footer Section',
                'group' => 'Footers',
                'default_content' => [
                    'companyName' => '{{COMPANY_NAME}}',
                    'address' => '{{COMPANY_ADDRESS}}',
                    'unsubscribeText' => 'Unsubscribe from this list',
                    'backgroundColor' => '{{PRIMARY_COLOR}}',
                    'textColor' => '{{TEXT_COLOR}}',
                ],
            ],

            // Video
            [
                'type' => 'video',
                'title' => 'Video Embed',
                'group' => 'Video',
                'default_content' => [
                    'url' => 'https://www.youtube.com/watch?v=xxxxxxx',
                    'caption' => '',
                ],
            ],

            // Other blocks like divider, spacer, quote, etc, with group property
            [
                'type' => 'divider',
                'title' => 'Divider',
                'group' => 'Basic Elements',
                'default_content' => [
                    'height' => '1px',
                    'color' => '{{PRIMARY_COLOR}}',
                ],
            ],
            [
                'type' => 'spacer',
                'title' => 'Spacer',
                'group' => 'Basic Elements',
                'default_content' => [
                    'height' => '24px',
                ],
            ],
            [
                'type' => 'quote',
                'title' => 'Quote / Testimonial',
                'group' => 'Basic Elements',
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
                'group' => 'Basic Elements',
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
        ];

        // idempotent upsert so seeder can run multiple times
        foreach ($defaults as $row) {
            EmailSectionTemplate::query()
                ->updateOrCreate(['type' => $row['type']], $row);
        }
    }
}
