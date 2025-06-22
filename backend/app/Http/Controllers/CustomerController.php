<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\Customer\CustomerDestroyService;
use App\Services\Customer\CustomerListService;
use App\Services\Customer\CustomerStoreService;
use App\Services\Customer\CustomerUpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Customer::class, 'customer');
    }

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

        $uuids = [];
        if ($tagIds = request('tag_ids')) {
            $uuids = explode(',', $tagIds);
        }

        $customers = CustomerListService::listCustomers(Auth::user()->company->id, $showInactive, $search, $uuids);

        return CustomerResource::collection($customers->paginate($perPage));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request): CustomerResource
    {
        $validated = $request->validated();
        // Add the company_id to the validated data
        $validated['company_id'] = Auth::user()->company->id;

        return new CustomerResource(CustomerStoreService::storeCustomer($validated));
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer): CustomerResource|JsonResponse
    {
        // Make sure the users company_id matches the customer's company_id
        if ($customer->company_id !== Auth::user()->company->id) {
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
        if ($customer->company_id !== Auth::user()->company->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $customer = CustomerUpdateService::updateCustomer($customer, $request->validated());
        return new CustomerResource($customer->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->company_id !== Auth::user()->company->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        CustomerDestroyService::destroyCustomer($customer);

        return response()->json(null, 204);
    }
}
