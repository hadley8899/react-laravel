<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_appointments');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        // Check that the appointment belongs to the user's company
        if ($appointment->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('view_appointments');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_appointments');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        // Check that the appointment belongs to the user's company
        if ($appointment->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('update_appointments');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        // Check that the appointment belongs to the user's company
        if ($appointment->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('delete_appointments');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Appointment $appointment): bool
    {
        // Check that the appointment belongs to the user's company
        if ($appointment->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('update_appointments');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Appointment $appointment): bool
    {
        // Check that the appointment belongs to the user's company
        if ($appointment->company_id !== $user->company_id) {
            return false;
        }
        return $user->hasPermissionTo('delete_appointments');
    }
}

