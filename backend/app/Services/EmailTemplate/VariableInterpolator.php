<?php

namespace App\Services\EmailTemplate;

use App\Models\Company;
use App\Models\Customer;
use Illuminate\Support\Facades\Log;

class VariableInterpolator
{
    public function interpolate(string $content, ?Company $company = null, ?Customer $customer = null): string
    {
        $map = [];

        /* ---------- company ---------- */
        if ($company) {
            $map = array_merge(
                $map,
                $company->specialVariableValues(),
                $company->variables()->pluck('value', 'key')->toArray(),
            );
        }

        /* ---------- customer ---------- */
        if ($customer) {

            Log::info('Customer found', ['customer_id' => $customer->id]);

            // built-ins
            foreach ($customer->specialVariableValues() as $k => $v) {
                $map["CUSTOMER.$k"] = $v;
            }

            // custom fields
            $values = $customer->customVariableValues()
                ->with('variable:id,key')
                ->get()
                ->pluck('value', 'variable.key')      // COUNT_OF_GOATS => "13"
                ->toArray();

            foreach ($values as $key => $value) {
                $map["CUSTOMER.$key"] = $value;
            }
        }

        return preg_replace_callback(
            '/\{\{\s*([A-Z0-9._]+)\s*}}/',
            static fn($m) => $map[$m[1]] ?? $m[0],
            $content
        );
    }
}
