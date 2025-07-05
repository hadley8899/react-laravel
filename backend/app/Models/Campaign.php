<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'company_id',
        'subject',
        'preheader_text',
        'from_address_id',
        'email_template_id',
        'reply_to',
        'contact_tag_ids',
        'status',
        'scheduled_at',
        'sent_at',
        'error_message',
    ];

    protected $casts = [
        'contact_tag_ids' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'status' => CampaignStatus::class,
    ];

    public function fromAddress()
    {
        return $this->belongsTo(FromAddress::class);
    }

    public function contacts()
    {
        return $this->hasMany(CampaignContact::class);
    }

    public function scopeQueued($query)
    {
        return $query->where('status', CampaignStatus::Queued);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function emailTemplate(): BelongsTo
    {
        return $this->belongsTo(EmailTemplate::class);
    }
}
