<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case Draft = 'draft';
    case Queued = 'queued';

    case Scheduled = 'scheduled';
    case Processing = 'processing';
    case Sending = 'sending';
    case Sent = 'sent';
    case Failed = 'failed';
}
