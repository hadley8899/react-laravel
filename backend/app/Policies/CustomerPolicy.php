<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_customers');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Customer $customer): bool
    {
        // Check that the customer belongs to the user's company
        if ($customer->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('view_customers');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_customers');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Customer $customer): bool
    {
        // Check that the customer belongs to the user's company
        if ($customer->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('update_customers');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Customer $customer): bool
    {
        // Check that the customer belongs to the user's company
        if ($customer->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('delete_customers');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Customer $customer): bool
    {
        // Check that the customer belongs to the user's company
        if ($customer->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('update_customers');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Customer $customer): bool
    {
        // Check that the customer belongs to the user's company
        if ($customer->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('delete_customers');
    }
}

