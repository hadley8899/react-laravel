<?php

namespace App\Services\EmailTemplate;

use Exception;
use Html2Text\Html2Text;
use Illuminate\Support\Facades\Log;
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

class HtmlCompiler
{
    /**
     * @return array{html:string,text:string}
     */
    public function compile(string $html): array
    {
        try {
            // --- 1. Inline CSS ---
            $cssToInlineStyles = new CssToInlineStyles();
            $html = $cssToInlineStyles->convert($html);
        } catch (Exception $e) {
            // Just fall back to the original HTML if inlining fails
            Log::error($e->getMessage());
        }

        // --- 2. Plain-text alternative ---
        $text = new Html2Text($html, ['ignore_errors' => true])->getText();

        return ['html' => $html, 'text' => $text];
    }
}
