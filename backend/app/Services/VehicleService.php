<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Vehicle;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleService
{
    /**
     * @param string|null $search
     * @param int $perPage
     * @param int $companyId
     * @return LengthAwarePaginator
     */
    public static function listVehicles(string|null $search, int $perPage, int $companyId): LengthAwarePaginator
    {
        $query = Vehicle::query()
            ->with(['customer'])
            ->where('company_id', $companyId)
            ->orderBy('id', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('make', 'like', "%$search%")
                    ->orWhere('model', 'like', "%$search%")
                    ->orWhere('registration', 'like', "%$search%")
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('first_name', 'like', "%$search%")
                            ->orWhere('last_name', 'like', "%$search%");
                    });
            });
        }

        return $query->paginate($perPage);
    }

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

    /**
     * @param array $validated
     * @return array
     * @throws Exception
     */
    private static function modifyTheValidatedData(array $validated): array
    {
        // From the validated data, We should have a customer_id, This is a UUID, So we need to get the raw id
        $customer = Customer::query()->where('uuid', $validated['customer_id'])->first();

        if ($customer === null) {
            throw new Exception('Customer not found');
        }

        $validated['customer_id'] = $customer->id;
        // Uppercase the registration
        $validated['registration'] = strtoupper($validated['registration']);

        return $validated;
    }
}
