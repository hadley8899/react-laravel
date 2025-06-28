<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyVariable extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'company_id',
        'friendly_name',
        'key',
        'value',
        'type',
        'meta',
        'can_be_deleted'
    ];

    protected $casts = [
        'meta' => 'array',
        'can_be_deleted' => 'boolean',
    ];

    /**
     * @return BelongsTo
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
