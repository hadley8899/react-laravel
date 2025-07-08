<?php

namespace App\Services\Campaign;

use App\Models\Company;

class CampaignListService extends CampaignService
{
    public static function listCampaigns(Company $company, ?string $status, ?string $search)
    {
        return $company->campaigns()
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($search, fn($q) => $q->where(function ($qq) use ($search) {
                $qq->where('subject', 'like', "%{$search}%")
                    ->orWhere('preheader_text', 'like', "%{$search}%");
            }))
            ->withCount('contacts')
            ->orderByDesc('created_at');
    }
}
