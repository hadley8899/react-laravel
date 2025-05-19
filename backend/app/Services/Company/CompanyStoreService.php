<?php

namespace App\Services\Company;

use App\Models\Company;

class CompanyStoreService extends CompanyService
{

    public static function storeCompany(array $validated): Company
    {
        return Company::query()->create($validated);
    }
}
