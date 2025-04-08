<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class CustomerController extends Controller
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function index(): AnonymousResourceCollection
    {
        $perPage = (int)request()->get('per_page', 10);
        $search = request()->get('search');

        $showInactive = true;
        if (request()->get('show_inactive', null)) {
            $showInactive = request()->get('show_inactive') === 'true';
        }

        $customers = Customer::query()
            ->where('company_id', Auth::user()->company_id)
            ->orderBy('last_name');

        if (!$showInactive) {
            $customers->where('status', '!=', 'Inactive');
        }

        if ($search) {
            $customers->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%$search%")
                    ->orWhere('last_name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            });
        }

        return CustomerResource::collection($customers->paginate($perPage));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request): CustomerResource
    {
        $validated = $request->validated();
        // Add the company_id to the validated data
        $validated['company_id'] = Auth::user()->company_id;

        $customer = Customer::query()->create($validated);
        return new CustomerResource($customer);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer): CustomerResource|JsonResponse
    {
        // Make sure the users company_id matches the customer's company_id
        if ($customer->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new CustomerResource($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): CustomerResource|JsonResponse
    {
        // Make sure the users company_id matches the customer's company_id
        if ($customer->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $customer->update($request->validated());
        return new CustomerResource($customer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $customer->delete();
        return response()->json(null, 204);
    }
}
