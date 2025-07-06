<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $hidden = ['id'];

    protected $fillable = [
        'uuid',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'status',
        'total_spent',
        'company_id',
    ];

    /* -------------------------------------------------------------
     |  Relationships
     | ------------------------------------------------------------- */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->using(CustomerTag::class);
    }

    public function customVariableValues(): HasMany
    {
        return $this->hasMany(ContactCustomVariableValue::class);
    }

    /* -------------------------------------------------------------
     |  Built-in variable helpers
     | ------------------------------------------------------------- */
    public static function specialVariableDefinitions(): array
    {
        return [
            ['key' => 'CUSTOMER.FIRST_NAME', 'friendly_name' => 'First Name', 'type' => 'text'],
            ['key' => 'CUSTOMER.LAST_NAME', 'friendly_name' => 'Last Name', 'type' => 'text'],
            ['key' => 'CUSTOMER.EMAIL', 'friendly_name' => 'Email', 'type' => 'text'],
            ['key' => 'CUSTOMER.PHONE', 'friendly_name' => 'Phone', 'type' => 'text'],
            ['key' => 'CUSTOMER.ADDRESS', 'friendly_name' => 'Address', 'type' => 'text'],
            ['key' => 'CUSTOMER.STATUS', 'friendly_name' => 'Status', 'type' => 'text'],
            ['key' => 'CUSTOMER.TOTAL_SPENT', 'friendly_name' => 'Total Spent', 'type' => 'text'],
            ['key' => 'CUSTOMER.UUID', 'friendly_name' => 'UUID', 'type' => 'text'],
        ];
    }

    public function specialVariableValues(): array
    {
        return [
            'FIRST_NAME' => $this->first_name,
            'LAST_NAME' => $this->last_name,
            'EMAIL' => $this->email,
            'PHONE' => $this->phone,
            'ADDRESS' => $this->address,
            'STATUS' => $this->status,
            'TOTAL_SPENT' => $this->total_spent,
            'UUID' => $this->uuid,
        ];
    }
}
