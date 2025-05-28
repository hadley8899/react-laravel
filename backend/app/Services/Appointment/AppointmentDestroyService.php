<?php

namespace App\Services\Appointment;

use App\Models\Appointment;

class AppointmentDestroyService extends AppointmentService
{
    public static function destroy(Appointment $appointment): ?bool
    {
        // Delete the appointment
        return $appointment->delete();
    }
}
