<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;

class CompanyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_settings');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Company $company): bool
    {
        // User can only view their own company
        return $user->hasPermissionTo('view_settings') && $user->company_id === $company->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only allow if user has permission (usually only admins)
        return $user->hasPermissionTo('update_company');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Company $company): bool
    {
        // Only allow if user has permission and company matches
        return $user->hasPermissionTo('update_company') && $user->company_id === $company->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Company $company): bool
    {
        // Only allow if user has permission and company matches
        return $user->hasPermissionTo('update_company') && $user->company_id === $company->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('update_company') && $user->company_id === $company->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('update_company') && $user->company_id === $company->id;
    }
}

