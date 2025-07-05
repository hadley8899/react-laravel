<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FromAddress extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = ['company_id', 'sending_domain_id', 'local_part', 'name', 'verified'];

    public function sendingDomain()
    {
        return $this->belongsTo(SendingDomain::class);
    }

    /* convenience */
    public function getEmailAttribute(): string
    {
        return $this->local_part . '@' . $this->sendingDomain->domain;
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

}
