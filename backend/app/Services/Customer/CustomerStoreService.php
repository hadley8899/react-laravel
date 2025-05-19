<?php

namespace App\Services\Customer;

use App\Models\Customer;

class CustomerStoreService extends CustomerService
{

    public static function storeCustomer(array $validated): Customer
    {
        return Customer::query()->create($validated);
    }
}
