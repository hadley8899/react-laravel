<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Requests\UpdateCompanySettingsRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $companies = Company::all();
        return response()->json($companies);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request): JsonResource
    {
        $company = Company::query()->create($request->validated());
        return new JsonResource($company);
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
        // Log the request for debugging
        Log::info('Company update request data', [
            'all' => $request->all(),
            'validated' => $request->validated(),
            'files' => $request->allFiles(),
        ]);

        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            try {
                // If we already have a logo, Delete it
                if ($company->logo_path) {
                    Storage::disk('public')->delete($company->logo_path);
                }

                $validated['logo_path'] = $request->file('logo')?->store('company-logos', 'public');

                $validated['logo_url'] = asset('storage/' . $validated['logo_path']);

                Log::info('Logo stored successfully', [
                    'path' => $validated['logo_path'],
                    'url' => $validated['logo_url'],
                ]);
            } catch (Exception $e) {
                Log::error('Error uploading logo', [
                    'exception' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        $company->update($validated);

        return new CompanyResource($company->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): JsonResponse
    {
        $company->delete();
        return response()->json(null, 204);
    }
}
