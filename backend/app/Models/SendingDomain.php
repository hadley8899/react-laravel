<?php

namespace App\Models;

use App\Enums\DomainStatus;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SendingDomain extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = ['company_id', 'domain', 'mailgun_id', 'state', 'dns_records'];
    protected $casts = [
        'dns_records' => 'array',
        'state' => DomainStatus::class,
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function fromAddresses(): HasMany
    {
        return $this->hasMany(FromAddress::class);
    }
}

