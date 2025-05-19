<?php

namespace App\Services\Vehicle;

use App\Models\Vehicle;
use App\Services\Vehicle\VehicleService;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleListService extends VehicleService
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
}
