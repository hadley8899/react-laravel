<?php

namespace App\Services\Vehicle;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;

class VehicleDestroyService extends VehicleService
{
    /**
     * @param Vehicle $vehicle
     * @param User $user
     * @return bool|JsonResponse|null
     */
    public static function destroyVehicle(Vehicle $vehicle, User $user): JsonResponse|bool|null
    {
        if ($vehicle->company_id !== $user->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $vehicle->delete();
    }
}
