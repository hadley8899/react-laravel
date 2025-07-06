<?php

namespace App\Services\Customer;

use App\Models\Customer;

class CustomerUpdateService extends CustomerService
{

    /**
     * @param Customer $customer
     * @param array $validated
     * @return Customer
     */
    public static function updateCustomer(Customer $customer, array $validated): Customer
    {
        $customKv = $validated['custom_variables'] ?? [];
        unset($validated['custom_variables']);

        $customer->update($validated);
        self::syncCustomVariables($customer, $customKv);
        return $customer->fresh('customVariableValues.variable');
    }
}
