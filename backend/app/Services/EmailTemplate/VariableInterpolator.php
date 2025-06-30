<?php
namespace App\Services\EmailTemplate;

use App\Models\Company;
class VariableInterpolator
{
    /**
     * Replace {{ VARIABLE_KEY }} tokens in $content using the
     * company's variable set.  Unrecognised tokens are left intact
     * so the editor can show “missing variable” warnings.
     */
    public function interpolate(string $content, Company $company): string
    {
        // Build an array ['PRIMARY_COLOR' => '#123456', ...]
        $map = $company->variables()
            ->pluck('value', 'key')
            ->toArray();

        return preg_replace_callback('/\{\{\s*([A-Z0-9_]+)\s*}}/', function ($m) use ($map) {
            return $map[$m[1]] ?? $m[0];   // fall back to original token
        }, $content);
    }
}
