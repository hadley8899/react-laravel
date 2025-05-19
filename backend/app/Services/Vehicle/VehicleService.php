<?php

namespace App\Services\Vehicle;

use App\Models\Customer;
use Exception;
use RuntimeException;

class VehicleService
{
    /**
     * @param array $validated
     * @return array
     * @throws Exception
     */
    protected static function modifyTheValidatedData(array $validated): array
    {
        // From the validated data, We should have a customer_id, This is a UUID, So we need to get the raw id
        $customer = Customer::query()->where('uuid', $validated['customer_id'])->first();

        if ($customer === null) {
            throw new RuntimeException('Customer not found');
        }

        $validated['customer_id'] = $customer->id;
        // Uppercase the registration
        $validated['registration'] = strtoupper($validated['registration']);

        return $validated;
    }
}
