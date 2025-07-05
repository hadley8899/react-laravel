<?php

namespace App\Http\Controllers;

use App\Enums\DomainStatus;
use App\Http\Requests\StoreSendingDomainRequest;
use App\Http\Resources\SendingDomainResource;
use App\Models\SendingDomain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Mailgun\Mailgun;
use Mailgun\Model\Domain\CreateResponse;
use Mailgun\Model\Domain\DnsRecord;
use Mailgun\Model\Domain\ShowResponse;
use Throwable;

class SendingDomainController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $domains = auth()->user()
            ->company
            ->sendingDomains()
            ->latest()
            ->get();

        return SendingDomainResource::collection($domains);
    }

    /**
     * @param StoreSendingDomainRequest $request
     * @return mixed
     */
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

                /* ─── Extract values via getters ───────────────────── */
                $mgDomain = $resp->getDomain();
                $mailgunId = $mgDomain->getId();

                $inboundRecords = $resp->getInboundDnsRecords() ?? [];
                $outboundRecords = $resp->getOutboundDnsRecords() ?? [];

                $dnsRecordsArr = array_map(function (DnsRecord $r) use ($domain) {
                    $name = $r->getName();
                    if ($r->getType() === 'MX') {
                        $name = $domain;
                    }

                    return [
                        'name' => $name,
                        'type' => $r->getType(),
                        'value' => $r->getValue(),
                        'priority' => $r->getPriority(),
                        'valid' => $r->isValid(),
                    ];
                }, array_merge($inboundRecords, $outboundRecords));

                $row->update([
                    'mailgun_id' => $mailgunId,
                    'dns_records' => $dnsRecordsArr,
                    // state remains 'pending' until DNS verified
                ]);
            } catch (Throwable $e) {
                $row->update(['state' => DomainStatus::Failed]);
                throw $e;
            }

            return new SendingDomainResource($row);
        });
    }

    public function verify(SendingDomain $sendingDomain): SendingDomainResource
    {
        // Authorisation: ensure the domain belongs to the current company
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

            /* Map DNS records again (latest validity flags) */
            $records = $this->mapRecords(
                array_merge(
                    $resp->getInboundDnsRecords() ?? [],
                    $resp->getOutboundDnsRecords() ?? []
                )
            );

            /* Determine new state */
            $newState = match ($mgDomain->getState()) {
                'active' => DomainStatus::Active,
                'unverified' => DomainStatus::Pending,
                default => DomainStatus::Failed,
            };

            $sendingDomain->update([
                'state' => $newState,
                'dns_records' => $records,
            ]);
        } catch (Throwable $e) {
            // keep current state but bubble error for UI toast
            throw $e;
        }

        return new SendingDomainResource($sendingDomain);
    }

    /** @param DnsRecord[] $records */
    private function mapRecords(array $records): array
    {
        return array_map(fn(DnsRecord $r) => [
            'name' => $r->getName(),
            'type' => $r->getType(),
            'value' => $r->getValue(),
            'priority' => $r->getPriority(),
            'valid' => $r->isValid(),
        ], $records);
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
