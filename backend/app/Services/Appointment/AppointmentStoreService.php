<?php

namespace App\Services\Appointment;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\User;
use App\Models\Vehicle;
use App\Notifications\AppointmentCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use InvalidArgumentException;

class AppointmentStoreService extends AppointmentService
{
    /**
     * @param int $companyId
     * @param string|null $customerUuId
     * @param string|null $vehicleUuId
     * @param string|null $serviceType
     * @param string|null $dateTime
     * @param int|null $durationMinutes
     * @param string|null $status
     * @param string|null $mechanicAssigned
     * @param string|null $notes
     * @return Appointment
     */
    public static function storeAppointment(
        User        $user,
        string|null $customerUuId = null,
        string|null $vehicleUuId = null,
        string|null $serviceType = null,
        string|null $dateTime = null,
        int|null    $durationMinutes = null,
        string|null $status = null,
        string|null $mechanicAssigned = null,
        string|null $notes = null
    ): Appointment
    {
        if (empty($customerUuId) || empty($vehicleUuId)) {
            throw new InvalidArgumentException('Customer UUID and Vehicle UUID are required.');
        }

        DB::beginTransaction();

        $customer = Customer::query()
            ->where('uuid', $customerUuId)
            ->where('company_id', $user->company->id)->firstOrFail();

        $vehicle = Vehicle::query()
            ->where('uuid', $vehicleUuId)
            ->where('company_id', $user->company->id)->firstOrFail();

        $appointment = Appointment::query()->create([
            'company_id' => $user->company->id,
            'customer_id' => $customer->id,
            'vehicle_id' => $vehicle->id,
            'service_type' => $serviceType,
            'date_time' => $dateTime,
            'duration_minutes' => $durationMinutes,
            'status' => $status,
            'mechanic_assigned' => $mechanicAssigned ?? null,
            'notes' => $notes ?? null,
        ]);

        DB::commit();

        return $appointment;

    }

    private static function notifyUsersAboutBooking(Appointment $appointment, User $loggedInUser): void
    {
        $companyId = $appointment->company_id;
        $users = User::query()->where('company_id', $companyId)->get();

        // Filter out the logged-in user
        $usersToNotify = $users->filter(function (User $user) use ($loggedInUser) {
            return $user->id !== $loggedInUser->id;
        });

        Notification::send(
            $usersToNotify,
            new AppointmentCreated($appointment)
        );
    }
}
