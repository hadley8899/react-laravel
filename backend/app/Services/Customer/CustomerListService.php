<?php

namespace App\Services\Customer;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;

class CustomerListService extends CustomerService
{
    /**
     * @param int $companyId
     * @param bool $showInactive
     * @param string|null $search
     * @param string[] $tagIds
     * @return Builder
     */
    public static function listCustomers(int $companyId, bool $showInactive = false, ?string $search = null, $tagIds = []): Builder
    {
        $customersQuery = Customer::query()
            ->with(['tags'])
            ->where('company_id',$companyId);

        if (!$showInactive) {
            $customersQuery->where('status', '!=', 'Inactive');
        }

        if (count($tagIds) > 0) {
            $customersQuery->whereHas('tags', fn($q) => $q->whereIn('tags.uuid', $tagIds));
        }

        if ($search) {
            $customersQuery->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%$search%")
                    ->orWhere('last_name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            });
        }

        $customersQuery->orderBy('first_name')->orderBy('last_name')->orderBy('email');

        return $customersQuery;
    }
}
