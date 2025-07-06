<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactCustomVariable extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'contact_custom_variables';

    protected $fillable = [
        'uuid',
        'company_id',
        'key',
        'friendly_name',
        'type',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /* ----------------------------------------------------- */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(ContactCustomVariableValue::class, 'custom_variable_id');
    }
}
