<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerImport extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid', 'company_id', 'user_id', 'filename', 'disk_path',
        'status', 'total_rows', 'imported_rows', 'failed_rows',
        'meta', 'started_at', 'finished_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    /* — Relationships — */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function failures(): HasMany
    {
        return $this->hasMany(CustomerImportFailure::class);
    }
}
