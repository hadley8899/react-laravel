<?php

namespace App\Services\EmailTemplate;

use Illuminate\Support\Facades\View;

class LayoutRenderer
{
    /**
     * Turn the saved JSON into MJML markup (with {{VARIABLES}} inside).
     * Each section type maps to a Blade partial under resources/views/emails/blocks/
     */
    public function toMjml(array $layout): string
    {
        return collect($layout)
            ->map(fn ($block) => View::make("emails.blocks.{$block['type']}", [
                'content' => $block['content'],
            ])->render())
            ->prepend('<mjml><mj-body>')
            ->push('</mj-body></mjml>')
            ->implode("\n");
    }
}
