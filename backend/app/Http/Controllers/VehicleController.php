<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
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
        $perPage = (int)request()->get('per_page', 10);
        $search = request()->get('search');

        $query = Vehicle::query()
            ->where('company_id', Auth::user()->company_id)
            ->orderBy('id', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('make', 'like', "%$search%")
                    ->orWhere('model', 'like', "%$search%")
                    ->orWhere('registration', 'like', "%$search%")
                    ->orWhere('owner', 'like', "%$search%");
            });
        }

        return VehicleResource::collection($query->paginate($perPage));
    }

    /** Store  */
    public function store(StoreVehicleRequest $request): VehicleResource
    {
        $validated = $request->validated();
        $validated['company_id'] = Auth::user()->company_id;

        $vehicle = Vehicle::create($validated);

        return new VehicleResource($vehicle);
    }

    /** Show  */
    public function show(Vehicle $vehicle): VehicleResource|JsonResponse
    {
        if ($vehicle->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return new VehicleResource($vehicle);
    }

    /** Update  */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): VehicleResource|JsonResponse
    {
        if ($vehicle->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $vehicle->update($request->validated());
        return new VehicleResource($vehicle);
    }

    /** Destroy  */
    public function destroy(Vehicle $vehicle): JsonResponse
    {
        if ($vehicle->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $vehicle->delete();
        return response()->json(null, 204);
    }
}
