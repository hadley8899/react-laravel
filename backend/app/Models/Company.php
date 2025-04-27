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
