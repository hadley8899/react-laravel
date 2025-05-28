<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AppointmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        // Check if user has the permission to read appointments
        return $user->can('read appointments');
    }

    public function view(User $user, Appointment $appointment): bool
    {
        // Check if user has read permission AND the appointment belongs to their company
        return $user->can('read appointments') &&
            $appointment->company_id === $user->company_id;
    }

    public function create(User $user): bool
    {
        return $user->can('store appointments');
    }

    public function update(User $user, Appointment $appointment): bool
    {
        return $user->can('update appointments') &&
            $appointment->company_id === $user->company_id;
    }

    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->can('delete appointments') &&
            $appointment->company_id === $user->company_id;
    }
}
