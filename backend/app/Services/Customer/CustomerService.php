<?php

namespace App\Services\Customer;

use App\Models\ContactCustomVariableValue;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    protected static function syncCustomVariables(Customer $customer, array $kv): void
    {
        if (!$kv) {
            return;
        }

        // kv array is [variableUuid => value]
        $definitions = $customer->company
            ->contactCustomVariables()
            ->whereIn('uuid', array_keys($kv))
            ->pluck('id', 'uuid');                          // uuid => id

        DB::transaction(function () use ($customer, $kv, $definitions) {
            foreach ($kv as $uuid => $value) {
                if (!isset($definitions[$uuid])) continue; // ignore invalid uuid
                ContactCustomVariableValue::updateOrCreate(
                    [
                        'customer_id' => $customer->id,
                        'custom_variable_id' => $definitions[$uuid],
                    ],
                    ['value' => $value],
                );
            }
        });
    }
}
