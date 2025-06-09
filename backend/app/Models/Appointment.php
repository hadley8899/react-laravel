<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\AppointmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/** @property-read Customer $customer */
/** @property-read Vehicle  $vehicle */
/** @property-read Company  $company
 * @property int $customer_id
 * @property int $vehicle_id
 */
class Appointment extends Model
{
    /** @use HasFactory<AppointmentFactory> */
    use HasFactory, SoftDeletes, HasUuid;

    protected $hidden   = ['id'];
    protected $casts    = ['date_time' => 'datetime'];
    protected $fillable = [
        'uuid', 'company_id', 'customer_id', 'vehicle_id',
        'service_type', 'date_time', 'duration_minutes',
        'status', 'mechanic_assigned', 'notes',
    ];

    /* ------------------------------------------------- relations */
    public function company(): BelongsTo   { return $this->belongsTo(Company::class); }
    public function customer(): BelongsTo  { return $this->belongsTo(Customer::class); }
    public function vehicle(): BelongsTo   { return $this->belongsTo(Vehicle::class); }
}
