<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->hasPermissionTo('manage_users') && $user->company_id === $model->company_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        return $user->hasPermissionTo('manage_users') && $user->company_id === $model->company_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        return $user->hasPermissionTo('manage_users') && $user->company_id === $model->company_id;
    }

    /**
     * Determine whether the user can view roles.
     */
    public function viewRoles(User $user): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    /**
     * Determine whether the user can view permissions.
     */
    public function viewPermissions(User $user): bool
    {
        return $user->hasPermissionTo('manage_users');
    }

    /**
     * Determine whether the user can assign roles.
     */
    public function assignRoles(User $user, User $model): bool
    {
        return $user->hasPermissionTo('manage_users') && $user->company_id === $model->company_id;
    }

    /**
     * Determine whether the user can assign permissions.
     */
    public function assignPermissions(User $user, User $model): bool
    {
        return $user->hasPermissionTo('manage_users') && $user->company_id === $model->company_id;
    }


}
