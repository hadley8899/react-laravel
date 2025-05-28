<?php

namespace App\Services\Vehicle;

use App\Models\Vehicle;
use App\Services\Vehicle\VehicleService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class VehicleListService extends VehicleService
{
    /**
     * @param string|null $search
     * @param int $companyId
     * @param string|null $customerUuId
     * @return Builder
     */
    public static function listVehicles(string|null $search, int $companyId, ?string $customerUuId = null,): Builder
    {
        $query = Vehicle::query()
            ->with(['customer'])
            ->where('company_id', $companyId)
            ->orderBy('id', 'desc');

        if ($customerUuId !== null) {
            $query->whereHas('customer', function ($q) use ($customerUuId, $companyId) {
                $q->where('uuid', $customerUuId)->where('company_id', $companyId);
            });
        }

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

        return $query;
    }
}
