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

            // Appointment Settings
            'default_appointment_duration' => $this->default_appointment_duration,
            'enable_online_booking' => $this->enable_online_booking,
            'send_appointment_reminders' => $this->send_appointment_reminders,
            // Return the stored value, could be null if reminders are off
            'appointment_reminder_timing' => $this->appointment_reminder_timing,
            // Optional
            'appointment_buffer_time' => $this->appointment_buffer_time,
            'min_booking_notice_hours' => $this->min_booking_notice_hours,

            'invoice_prefix' => $this->invoice_prefix,
            'next_invoice_number' => $this->next_invoice_number,
            'default_payment_terms' => $this->default_payment_terms,
            'invoice_footer_notes' => $this->invoice_footer_notes,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
