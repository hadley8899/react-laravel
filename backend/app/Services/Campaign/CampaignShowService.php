<?php

namespace App\Services\Campaign;

use App\Models\Campaign;

class CampaignShowService extends CampaignService
{
    /**
     * @param Campaign $campaign
     * @return Campaign
     */
    public static function show(Campaign $campaign): Campaign
    {
        $campaign->loadCount('contacts')
            ->load(['emailTemplate', 'fromAddress']);

        return $campaign;
    }
}
