<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'phone' => $this->phone,
            'status' => $this->status,
            'company' => new CompanyResource($this->company),

            // Preferences
            'notify_new_booking' => $this->notify_new_booking,
            'notify_job_complete' => $this->notify_job_complete,
            'preferred_theme' => $this->preferred_theme,

            // Permissions
            'role' => $this->roles->pluck('name')->first(),
            'permissions' => $this->getAllPermissions()->pluck('name'),

            // Timestamps
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
