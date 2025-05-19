<?php

namespace App\Services\Vehicle;

use App\Models\Vehicle;
use Exception;

class VehicleStoreService extends VehicleService
{
    /**
     * @param array $validated
     * @param int $companyId
     * @return Vehicle
     * @throws Exception
     */
    public static function store(array $validated, int $companyId): Vehicle
    {
        $validated['company_id'] = $companyId;

        $validated = self::modifyTheValidatedData($validated);

        return Vehicle::query()->with(['customer'])->create($validated);
    }
}
