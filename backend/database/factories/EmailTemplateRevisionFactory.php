<?php

namespace Database\Factories;

use App\Models\{EmailTemplate, EmailTemplateRevision};
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailTemplateRevisionFactory extends Factory
{
    protected $model = EmailTemplateRevision::class;

    public function definition(): array
    {
        $template = EmailTemplate::inRandomOrder()->first()
            ?? EmailTemplate::factory()->create();

        return [
            'template_id' => $template->id,
            'layout_json' => $template->layout_json,
            'html_cached' => $template->html_cached,
            'text_cached' => $template->text_cached,
            'created_by'  => $template->created_by,
            'created_at'  => now(),
        ];
    }
}
