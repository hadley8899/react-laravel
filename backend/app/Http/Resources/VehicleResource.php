<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid'              => $this->uuid,
            'make'            => $this->make,
            'model'           => $this->model,
            'year'            => $this->year,
            'registration'    => $this->registration,
            'status'          => $this->status,
            'owner'          => $this->customer
                ? $this->customer->first_name . ' ' . $this->customer->last_name
                : null,
            'lastService'     => optional($this->last_service)->toDateString(),
            'nextServiceDue'  => optional($this->next_service_due)->toDateString(),
            'type'            => $this->type,
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];
    }
}
