<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\Vehicle\VehicleDestroyService;
use App\Services\Vehicle\VehicleListService;
use App\Services\Vehicle\VehicleStoreService;
use App\Services\Vehicle\VehicleUpdateService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class VehicleController extends Controller
{
    /**
     * Display a paginated list.
     * @throws ContainerExceptionInterface|NotFoundExceptionInterface
     */
    public function index(): AnonymousResourceCollection
    {
        return VehicleResource::collection(VehicleListService::listVehicles(
            request()->get('search'),
            (int)request()->get('per_page', 10),
            (int)Auth::user()->company_id,
        ));
    }

    /**
     * @param StoreVehicleRequest $request
     * @return VehicleResource
     * @throws Exception
     */
    public function store(StoreVehicleRequest $request): VehicleResource
    {
        return new VehicleResource(
            VehicleStoreService::store(
                $request->validated(),
                Auth::user()->company_id
            )
        );
    }

    /**
     * @param Vehicle $vehicle
     * @return VehicleResource|JsonResponse
     */
    public function show(Vehicle $vehicle): VehicleResource|JsonResponse
    {
        if ($vehicle->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return new VehicleResource($vehicle);
    }

    /**
     * @param UpdateVehicleRequest $request
     * @param Vehicle $vehicle
     * @return VehicleResource|JsonResponse
     * @throws Exception
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): VehicleResource|JsonResponse
    {
        if ($vehicle->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new VehicleResource(VehicleUpdateService::update($request->validated(), $vehicle));
    }

    /**
     * @param Vehicle $vehicle
     * @return JsonResponse
     */
    public function destroy(Vehicle $vehicle): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        VehicleDestroyService::destroyVehicle($vehicle, $user);
        return response()->json(null, 204);
    }
}
