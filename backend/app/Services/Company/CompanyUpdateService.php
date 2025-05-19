<?php

namespace App\Services\Company;

use App\Models\Company;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CompanyUpdateService extends CompanyService
{
    /**
     * @param Company $company
     * @param array $validated
     * @param $logo
     * @return Company
     *
     */
    public static function updateCompany(Company $company, array $validated, $logo): Company
    {
        if ($logo) {
            try {
                // If we already have a logo, Delete it
                if ($company->logo_path) {
                    Storage::disk('public')->delete($company->logo_path);
                }

                $validated['logo_path'] = $logo->store('company-logos', 'public');

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

        return $company;
    }
}
