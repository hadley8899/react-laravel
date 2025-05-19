<?php

namespace App\Services\Vehicle;

use App\Models\Customer;
use App\Models\Vehicle;
use Exception;
use RuntimeException;

class VehicleUpdateService extends VehicleService
{
    /**
     * @param array $validated
     * @param Vehicle $vehicle
     * @return Vehicle
     * @throws Exception
     */
    public static function update(array $validated, Vehicle $vehicle): Vehicle
    {
        $validated = self::modifyTheValidatedData($validated);

        $vehicle->update($validated);

        return $vehicle;
    }
}
