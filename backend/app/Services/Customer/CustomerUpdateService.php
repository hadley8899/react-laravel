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
        $customer->update($validated);
        return $customer;
    }
}
