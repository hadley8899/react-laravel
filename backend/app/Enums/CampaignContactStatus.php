<?php

namespace App\Enums;

enum CampaignContactStatus: string
{
    case Pending = 'pending';
    case Sent = 'sent';
    case Opened = 'opened';
    case Clicked = 'clicked';
    case Bounced = 'bounced';
    case Failed = 'failed';
}
