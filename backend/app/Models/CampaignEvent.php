<?php

namespace App\Models;

use App\Enums\CampaignEventType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class CampaignEvent extends Model
{
    use HasUuid;
    public $timestamps = false;

    protected $fillable = [
        'campaign_contact_id',
        'type',
        'data',
        'created_at',
    ];

    protected $casts = [
        'data' => 'array',
        'created_at' => 'datetime',
        'type' => CampaignEventType::class,
    ];

    public function campaignContact()
    {
        return $this->belongsTo(CampaignContact::class);
    }
}
