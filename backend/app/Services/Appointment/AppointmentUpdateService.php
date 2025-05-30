<?php

namespace App\Services\Appointment;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class AppointmentUpdateService extends AppointmentService
{
    /**
     * Update an appointment with validated data
     *
     * @param Appointment $appointment
     * @param array $validated
     * @return Appointment
     * @throws Throwable
     */
    public static function update(Appointment $appointment, array $validated): Appointment
    {
        try {
            DB::beginTransaction();

            if (isset($validated['customer_uuid'])) {
                $appointment->customer_id = Customer::query()
                    ->where('uuid', $validated['customer_uuid'])
                    ->where('company_id', Auth::user()->company->id)
                    ->value('id');
            }

            if (isset($validated['vehicle_uuid'])) {
                $appointment->vehicle_id = Vehicle::query()
                    ->where('uuid', $validated['vehicle_uuid'])
                    ->where('company_id', Auth::user()->company->id)
                    ->value('id');
            }

            // Remove UUIDs from the validated data before filling
            unset($validated['customer_uuid'], $validated['vehicle_uuid']);

            $appointment->fill($validated)->save();

            DB::commit();

            return $appointment->fresh(['customer', 'vehicle']);
        } catch (Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
