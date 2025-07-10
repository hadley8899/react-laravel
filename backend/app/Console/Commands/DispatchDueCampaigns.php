<?php

namespace App\Console\Commands;

use App\Enums\CampaignStatus;
use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as CommandAlias;

class DispatchDueCampaigns extends Command
{
    protected $signature = 'campaign:dispatch-due {--chunk=200}';
    protected $description = 'Enqueue SendCampaignJob for campaigns whose scheduled_at is due';

    public function handle(): int
    {
        $now = now('UTC');
        $chunk = (int)$this->option('chunk');
        $sent = 0;

        echo "Dispatching due campaigns...\n";
        $this->info("Current time: $now");

        Campaign::query()->where('status', CampaignStatus::Scheduled)
            ->where('scheduled_at', '<=', $now)
            ->chunkById($chunk, function ($campaigns) use (&$sent) {
                foreach ($campaigns as $campaign) {
                    SendCampaignJob::dispatch($campaign)->onQueue('mail');
                    $campaign->update(['status' => CampaignStatus::Queued]);
                    $sent++;
                }
            });

        $this->info("Dispatched $sent due campaign(s).");
        return CommandAlias::SUCCESS;
    }
}
