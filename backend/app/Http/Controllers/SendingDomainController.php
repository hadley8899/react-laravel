<?php

namespace App\Http\Controllers;

use App\Enums\DomainStatus;
use App\Http\Requests\StoreSendingDomainRequest;
use App\Http\Resources\SendingDomainResource;
use App\Models\SendingDomain;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Mailgun\Mailgun;
use Mailgun\Model\Domain\CreateResponse;
use Mailgun\Model\Domain\DnsRecord;
use Mailgun\Model\Domain\ShowResponse;
use Psr\Http\Client\ClientExceptionInterface;
use Throwable;

class SendingDomainController extends Controller
{
    private const array MAILGUN_WEBHOOK_EVENTS = [
        'accepted',
        'delivered',
        'opened',
        'clicked',
        'complained',
        'unsubscribed',
        'permanent_fail',
        'temporary_fail',
    ];

    public function index(): AnonymousResourceCollection
    {
        $domains = Auth::user()
            ->company
            ->sendingDomains()
            ->latest()
            ->get();

        return SendingDomainResource::collection($domains);
    }

    /* --------------------------------------------------------------
     |  CREATE (← customer enters a domain)
     |-------------------------------------------------------------- */
    public function store(StoreSendingDomainRequest $request): SendingDomainResource
    {
        $company = $request->user()->company;
        $domain = $request->string('domain')->lower();

        return DB::transaction(function () use ($company, $domain) {
            /** @var SendingDomain $row */
            $row = $company->sendingDomains()->create([
                'domain' => $domain,
                'state' => DomainStatus::Pending,
            ]);

            try {
                $mg = Mailgun::create(
                    config('services.mailgun.secret'),
                    config('services.mailgun.endpoint')
                );

                /** @var CreateResponse $resp */
                $resp = $mg->domains()->create(
                    $domain,
                    bin2hex(random_bytes(8)), // smtp_password
                    'disabled',               // spamAction
                    false,                    // wildcard
                    true                      // force_dkim_authority
                );

                /* ── Persist meta + DNS records ───────────────── */
                $mgDomain = $resp->getDomain();
                $mailgunId = $mgDomain->getId();

                $dnsRecordsArr = $this->mapRecords(
                    array_merge(
                        $resp->getInboundDnsRecords() ?? [],
                        $resp->getOutboundDnsRecords() ?? []
                    ),
                    $domain
                );

                $row->update([
                    'mailgun_id' => $mailgunId,
                    'dns_records' => $dnsRecordsArr,
                ]);

                $this->registerMailgunWebhooks($mg, $domain);
            } catch (Throwable $e) {
                $row->update(['state' => DomainStatus::Failed]);
                throw $e;
            }

            return new SendingDomainResource($row);
        });
    }

    public function verify(SendingDomain $sendingDomain): SendingDomainResource
    {
        abort_if(
            $sendingDomain->company_id !== Auth::user()->company->id,
            403,
            'Not authorised to verify this domain.'
        );

        try {
            $mg = Mailgun::create(
                config('services.mailgun.secret'),
                config('services.mailgun.endpoint')
            );

            $mg->domains()->verify($sendingDomain->domain);

            /** @var ShowResponse $resp */
            $resp = $mg->domains()->show($sendingDomain->domain);
            $mgDomain = $resp->getDomain();
            $newState = match ($mgDomain->getState()) {
                'active' => DomainStatus::Active,
                'unverified' => DomainStatus::Pending,
                default => DomainStatus::Failed,
            };

            $sendingDomain->update([
                'state' => $newState,
                'dns_records' => $this->mapRecords(
                    array_merge(
                        $resp->getInboundDnsRecords() ?? [],
                        $resp->getOutboundDnsRecords() ?? []
                    )
                ),
            ]);

            if ($newState === DomainStatus::Active) {
                $this->registerMailgunWebhooks($mg, $sendingDomain->domain);
            }
        } catch (Throwable $e) {
            throw $e; // bubbles to UI toast; keeps current state
        }

        return new SendingDomainResource($sendingDomain);
    }

    private function mapRecords(array $records, ?string $domain = null): array
    {
        return array_map(function (DnsRecord $r) use ($domain) {
            $name = $r->getName();
            if ($r->getType() === 'MX' && $domain) {
                $name = $domain;
            }

            return [
                'name' => $name,
                'type' => $r->getType(),
                'value' => $r->getValue(),
                'priority' => $r->getPriority(),
                'valid' => $r->isValid(),
            ];
        }, $records);
    }

    /**
     * @throws Throwable
     * @throws ClientExceptionInterface
     */
    private function registerMailgunWebhooks(Mailgun $mg, string $domain): void
    {
        $webhookUrl = rtrim(config('app.url'), '/') . '/api/webhooks/mailgun';

        foreach (self::MAILGUN_WEBHOOK_EVENTS as $event) {
            try {
                $mg->webhooks()->create($domain, $event, [$webhookUrl]);
            } catch (Throwable $e) {
                if (!str_contains($e->getMessage(), 'Webhook already exists')) {
                    throw $e;
                }
            }
        }
    }

    public function verified(): AnonymousResourceCollection
    {
        $domains = Auth::user()
            ->company
            ->sendingDomains()
            ->where('state', DomainStatus::Active)
            ->get();

        return SendingDomainResource::collection($domains);
    }
}
