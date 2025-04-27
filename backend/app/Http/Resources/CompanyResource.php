<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'slug' => $this->slug,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'status' => $this->status,
            'logo_url' => $this->logo_url,
            'country' => $this->country,
            'timezone' => $this->timezone,
            'currency' => $this->currency,
            'tax_id' => $this->tax_id,
            'registration_number' => $this->registration_number,
            'industry' => $this->industry,
            'plan' => $this->plan,
            'trial_ends_at' => $this->trial_ends_at,
            'active_until' => $this->active_until,
            'locale' => $this->locale,
            'default_units' => $this->default_units,
            'billing_address' => $this->billing_address,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
