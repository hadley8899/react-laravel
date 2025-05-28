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
        // TODO replace with actual permission check when implemented
        return true;
    }

    public function view(User $user, Appointment $appointment): bool
    {
        return $appointment->company_id === $user->company_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Appointment $appointment): bool
    {
        return $appointment->company_id === $user->company_id;
    }

    public function delete(User $user, Appointment $appointment): bool
    {
        return $appointment->company_id === $user->company_id;
    }
}
