<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'make' => $this->make,
            'model' => $this->model,
            'year' => $this->year,
            'registration' => $this->registration,
            'customer' => new CustomerResource($this->customer),
            'last_service' => optional($this->last_service)->toDateString(),
            'next_service_due' => optional($this->next_service_due)->toDateString(),
            'type' => $this->type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
