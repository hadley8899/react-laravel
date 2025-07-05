<?php

namespace App\Models;

use App\Enums\CampaignContactStatus;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignContact extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'campaign_id',
        'customer_id',
        'status',
        'provider_message_id',
        'sent_at',
        'opened_at',
        'clicked_at',
        'bounced_at',
        'error_message',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'bounced_at' => 'datetime',
        'status' => CampaignContactStatus::class,
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function events()
    {
        return $this->hasMany(CampaignEvent::class);
    }
}
