<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid'              => $this->uuid,
            'service_type'      => $this->service_type,
            'date_time'         => $this->date_time->toIso8601String(),
            'duration_minutes'  => $this->duration_minutes,
            'status'            => $this->status,
            'mechanic_assigned' => $this->mechanic_assigned,
            'notes'             => $this->notes,

            'customer' => new CustomerResource($this->customer),
            'vehicle'  => new VehicleResource($this->vehicle),
        ];
    }
}
