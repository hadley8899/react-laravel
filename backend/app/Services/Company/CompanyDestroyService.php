<?php

namespace App\Services\Company;

class CompanyDestroyService extends CompanyService
{
    public static function destroyCompany($company): bool
    {
        return $company->delete();
    }
}
