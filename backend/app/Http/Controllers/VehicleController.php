<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\User;
use App\Models\Vehicle;
use Exception;
use Illuminate\Http\JsonResponse;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use App\Services\Vehicle\{
    VehicleListService,
    VehicleStoreService,
    VehicleUpdateService,
    VehicleDestroyService
};
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Vehicle::class, 'vehicle');
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function index(): AnonymousResourceCollection
    {
        $search = request()->get('search', '');
        $customerUuid = request()->get('customer_uuid', null);
        return VehicleResource::collection(
            VehicleListService::listVehicles(
                $search,
                Auth::user()->company->id,
                $customerUuid,
            )->paginate((int)request('per_page', 10))
        );
    }

    /**
     * @throws Exception
     */
    public function store(StoreVehicleRequest $request): VehicleResource
    {
        $vehicle = VehicleStoreService::store(
            $request->validated(),
            Auth::user()->company->id
        );

        return new VehicleResource($vehicle);
    }

    public function show(Vehicle $vehicle): VehicleResource
    {
        return new VehicleResource($vehicle);
    }

    /**
     * @throws Exception
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): VehicleResource
    {
        $vehicle = VehicleUpdateService::update($request->validated(), $vehicle);

        return new VehicleResource($vehicle);
    }

    public function destroy(Vehicle $vehicle): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        VehicleDestroyService::destroyVehicle($vehicle, $user);

        return response()->json(null, 204);
    }
}
