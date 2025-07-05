<?php

namespace App\Enums;

enum CampaignEventType: string
{
    case Open = 'open';
    case Click = 'click';
    case Bounce = 'bounce';
    case Complaint = 'complaint';
}
