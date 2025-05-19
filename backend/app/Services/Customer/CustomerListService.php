<?php

namespace App\Services\Customer;

use App\Models\Customer;
use Illuminate\Support\Facades\Auth;

class CustomerListService extends CustomerService
{

    public static function listCustomers(int $companyId, bool $showInactive = false, string $search = null, $perPage = 10): \Illuminate\Pagination\LengthAwarePaginator
    {
        $customers = Customer::query()
            ->where('company_id',$companyId)
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

        return $customers->paginate($perPage);
    }
}
