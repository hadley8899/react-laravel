<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyBillingRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Requests\Company\UpdateCompanySettingsRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Services\Company\CompanyDestroyService;
use App\Services\Company\CompanyListService;
use App\Services\Company\CompanyStoreService;
use App\Services\Company\CompanyUpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Company::class, 'company');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        return CompanyResource::collection(CompanyListService::listCompanies());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request): CompanyResource
    {
        return new CompanyResource(CompanyStoreService::storeCompany($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company): JsonResource
    {
        return new CompanyResource($company);
    }

    /**
     * Display the currently authenticated user's company details.
     */
    public function currentCompany(): CompanyResource|JsonResponse
    {
        $company = Auth::user()->company;

        if (!$company) {
            return response()->json(['message' => 'Company not found for the user.'], 404);
        }

        return new CompanyResource($company);
    }

    /**
     * Update the specified company's appointment settings.
     */
    public function updateSettings(UpdateCompanySettingsRequest $request, Company $company): CompanyResource|JsonResponse
    {
        // Extract only the settings fields from the validated data
        $settingsData = $request->validated();

        // Handle nullable reminder timing if reminders are off
        if (isset($settingsData['send_appointment_reminders']) && !$settingsData['send_appointment_reminders']) {
            $settingsData['appointment_reminder_timing'] = false;
        }

        $company->update($settingsData);

        return new CompanyResource($company->fresh());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, Company $company): JsonResource
    {
        $validated = $request->validated();
        $file = $request->file('logo');

        $company = CompanyUpdateService::updateCompany($company, $validated, $file);

        return new CompanyResource($company->fresh());
    }

    public function updateBilling(UpdateCompanyBillingRequest $request, Company $company): CompanyResource
    {
        $validated = $request->validated();

        $company->update($validated);
        return new CompanyResource($company->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): JsonResponse
    {
        CompanyDestroyService::destroyCompany($company);
        return response()->json(null, 204);
    }
}
