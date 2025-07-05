<?php

namespace App\Http\Controllers;

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignStatus;
use App\Http\Requests\StoreCampaignRequest;
use App\Http\Resources\CampaignListResource;
use App\Http\Resources\CampaignResource;
use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use App\Models\CampaignContact;
use App\Models\Customer;
use App\Models\EmailTemplate;
use App\Models\FromAddress;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CampaignController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $company = $request->user()->company;

        $perPage = (int)$request->input('per_page', 15);
        $status = $request->filled('status') ? $request->string('status') : null;
        $search = $request->filled('search') ? trim($request->string('search')) : null;

        $page = $company->campaigns()
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($search, fn($q) => $q->where(function ($qq) use ($search) {
                /* subject OR pre-header */
                $qq->where('subject', 'like', "%{$search}%")
                    ->orWhere('preheader_text', 'like', "%{$search}%");
            }))
            ->withCount('contacts')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        /* Laravel will automatically append pagination meta when a paginator
           is passed to a resource collection. */
        return CampaignListResource::collection($page);
    }

    public function show(Request $request, Campaign $campaign): CampaignResource
    {
        abort_if($campaign->company_id !== $request->user()->company_id, 403);

        $campaign->loadCount('contacts')
            ->load(['emailTemplate', 'fromAddress']);

        return new CampaignResource($campaign);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $company = $request->user()->company;

        $template = EmailTemplate::whereUuid($request->template_uuid)->firstOrFail();

        $tagIds = Tag::query()->whereIn('uuid', $request->tag_uuids)->pluck('id');
        if ($tagIds->isEmpty()) {
            return response()->json(['message' => 'At least one tag is required.'], 422);
        }

        $from = FromAddress::query()->where('uuid', $request->from_address_uuid)
            ->where('company_id', $company->id)
            ->where('verified', true)
            ->firstOrFail();

        /* ---------- normalise schedule ---------- */
        $scheduledAt = $request->scheduled_at
            ? Carbon::parse($request->scheduled_at)->timezone('UTC')
            : null;

        $status = $scheduledAt && $scheduledAt->isFuture()
            ? CampaignStatus::Scheduled
            : CampaignStatus::Queued;

        /* ---------- create + snapshot ---------- */
        $campaign = DB::transaction(function () use (
            $company, $template, $tagIds, $from, $request, $scheduledAt, $status
        ) {
            /** @var Campaign $campaign */
            $campaign = $company->campaigns()->create([
                'email_template_id' => $template->id,
                'subject' => $request->string('subject'),
                'preheader_text' => $request->string('preheader_text'),
                'from_address_id' => $from->id,
                'reply_to' => $request->string('reply_to'),
                'contact_tag_ids' => $tagIds,
                'status' => $status,
                'scheduled_at' => $scheduledAt,
            ]);

            /* snapshot of current recipients */
            $customerIds = Customer::query()->where('company_id', $company->id)
                ->whereHas('tags', fn($q) => $q->whereIn('tags.id', $tagIds))
                ->pluck('customers.id');

            $payload = $customerIds->map(fn($cid) => [
                'uuid' => CampaignContact::generateUuid(),
                'campaign_id' => $campaign->id,
                'customer_id' => $cid,
                'status' => CampaignContactStatus::Pending,
                'created_at' => now(),
                'updated_at' => now(),
            ])->all();

            CampaignContact::query()->insert($payload);

            return $campaign;
        });

        /* ---------- queue immediately if due ---------- */
        if (is_null($campaign->scheduled_at) || $campaign->scheduled_at->lte(now('UTC'))) {
            SendCampaignJob::dispatch($campaign)->onQueue('mail');
        }

        return response()->json(['data' => $campaign->loadCount('contacts')], 201);
    }
}
