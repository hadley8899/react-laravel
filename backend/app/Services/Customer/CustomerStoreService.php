<?php

namespace App\Services\Customer;

use App\Models\Customer;

class CustomerStoreService extends CustomerService
{

    public static function storeCustomer(array $validated): Customer
    {
        $customKv = $validated['custom_variables'] ?? [];
        unset($validated['custom_variables']);

        $customer = Customer::query()->create($validated);
        self::syncCustomVariables($customer, $customKv);
        return $customer->fresh('customVariableValues.variable');
    }
}
