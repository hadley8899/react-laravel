<?php

namespace App\Services\Customer;

use App\Models\Customer;

class CustomerDestroyService extends CustomerService
{

    public static function destroyCustomer(Customer $customer): void
    {
        $customer->delete();
    }
}
