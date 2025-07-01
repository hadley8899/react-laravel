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
        // Use the special variable values from the Company model
        $companySettingsVariables = $company->specialVariableValues();

        $map = $company->variables()
            ->pluck('value', 'key')
            ->toArray();

        // Merge company settings variables into the map
        $map = array_merge($companySettingsVariables, $map);

        return preg_replace_callback('/\{\{\s*([A-Z0-9_]+)\s*}}/', function ($m) use ($map) {
            return $map[$m[1]] ?? $m[0];   // fall back to original token
        }, $content);
    }
}
