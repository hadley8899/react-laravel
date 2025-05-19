<?php

namespace App\Services\Company;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;

class CompanyListService extends CompanyService
{

    public static function listCompanies(): Collection
    {
        return Company::all();
    }
}
