<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vehicle;

class VehiclePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_vehicles');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Vehicle $vehicle): bool
    {
        // Check that the vehicle belongs to the user's company
        if ($vehicle->company_id !== $user->company_id) {
            return false;
        }


        return $user->hasPermissionTo('view_vehicles');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_vehicles');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Vehicle $vehicle): bool
    {
        // Check that the vehicle belongs to the user's company
        if ($vehicle->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('update_vehicles');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Vehicle $vehicle): bool
    {
        // Check that the vehicle belongs to the user's company
        if ($vehicle->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('delete_vehicles');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Vehicle $vehicle): bool
    {
        // Check that the vehicle belongs to the user's company
        if ($vehicle->company_id !== $user->company_id) {
            return false;
        }

        return $user->hasPermissionTo('update_vehicles');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Vehicle $vehicle): bool
    {
        // Check that the vehicle belongs to the user's company
        if ($vehicle->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('delete_vehicles');
    }
}

