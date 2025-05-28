<?php

namespace App\Services\Appointment;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
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
     * @return Appointment|Model
     */
    public static function storeAppointment(
        int         $companyId,
        string|null $customerUuId = null,
        string|null $vehicleUuId = null,
        string|null $serviceType = null,
        string|null $dateTime = null,
        int|null    $durationMinutes = null,
        string|null $status = null,
        string|null $mechanicAssigned = null,
        string|null $notes = null
    )
    {
        if (empty($customerUuId) || empty($vehicleUuId)) {
            throw new InvalidArgumentException('Customer UUID and Vehicle UUID are required.');
        }

        // Validate the input data
        if (empty($v['service_type']) || empty($dateTime) || empty($durationMinutes)) {
            throw new InvalidArgumentException('Service type, date time, and duration minutes are required.');
        }
        {
            DB::beginTransaction();

            $customer = Customer::whereUuid($customerUuId)
                ->where('company_id', $companyId)->firstOrFail();

            $vehicle = Vehicle::whereUuid($vehicleUuId)
                ->where('company_id', $companyId)->firstOrFail();

            $appointment = Appointment::query()->create([
                'company_id' => $companyId,
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
    }
}
