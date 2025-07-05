<?php

namespace App\Enums;

enum DomainStatus: string
{
    case Pending = 'pending';   // waiting for DNS
    case Active = 'active';    // verified
    case Failed = 'failed';    // could not verify (or was disabled)
}
