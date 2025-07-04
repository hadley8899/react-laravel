<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\CompleteCompanySetupRequest;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyBillingRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Requests\Company\UpdateCompanySettingsRequest;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\User;
use App\Services\Company\CompanyDestroyService;
use App\Services\Company\CompanyListService;
use App\Services\Company\CompanyStoreService;
use App\Services\Company\CompanyUpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        // Restrict plan fields to users with permission
        $planFields = ['plan', 'status', 'trial_ends_at', 'active_until'];
        if (!Auth::user()->can('update_company_plan_settings')) {
            foreach ($planFields as $field) {
                unset($validated[$field]);
            }
        }

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

    public function switchCompany(Request $request): UserResource|JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user->can('switch_companies')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $companyUuId = $request->input('company_id');

        $company = Company::query()->where('uuid', $companyUuId)->firstOrFail();

        $user->company_id = $company->id;
        $user->save();

        $user->refresh();

        return new UserResource($user);
    }

    public function completeSetup(CompleteCompanySetupRequest $request, Company $company): JsonResponse
    {
        $this->authorize('update', $company);

        $validated = $request->validated();

        $company->fill($validated);
        $company->setup_complete = true;
        $company->save();

        return response()->json(['company' => $company->fresh()]);
    }
}
