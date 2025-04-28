<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $hidden = ['id', 'logo_path', 'deleted_at'];

    protected $appends = ['logo_url'];

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'address',
        'phone',
        'email',
        'website',
        'status',
        'logo_path',
        'country',
        'timezone',
        'currency',
        'tax_id',
        'registration_number',
        'industry',
        'plan',
        'trial_ends_at',
        'active_until',
        'locale',
        'default_units',
        'billing_address',
        'notes',
        'default_appointment_duration',
        'enable_online_booking',
        'send_appointment_reminders',
        'appointment_reminder_timing',
        'appointment_buffer_time',
        'min_booking_notice_hours',
    ];

    protected $casts = [
        // Add casts for boolean and potentially integer values
        'enable_online_booking' => 'boolean',
        'send_appointment_reminders' => 'boolean',
        'default_appointment_duration' => 'integer',
        'appointment_buffer_time' => 'integer',
        'min_booking_notice_hours' => 'integer',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null;
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
