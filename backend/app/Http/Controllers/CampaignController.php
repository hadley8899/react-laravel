<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCampaignRequest;
use App\Http\Resources\CampaignListResource;
use App\Http\Resources\CampaignResource;
use App\Models\Campaign;
use App\Services\Campaign\CampaignListService;
use App\Services\Campaign\CampaignShowService;
use App\Services\Campaign\CampaignStoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CampaignController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $company = $request->user()->company;

        $perPage = (int) $request->input('per_page', 15);
        $status  = $request->filled('status') ? $request->string('status') : null;
        $search  = $request->filled('search') ? trim($request->string('search')) : null;

        $campaignListQuery = CampaignListService::listCampaigns(
            $company,
            $status,
            $search
        );

        $page = $campaignListQuery->orderByDesc('created_at')->paginate($perPage);

        return CampaignListResource::collection($page);
    }

    public function show(Request $request, Campaign $campaign): CampaignResource
    {
        abort_if($campaign->company_id !== $request->user()->company_id, 403);

        $campaign = CampaignShowService::show($campaign);

        return new CampaignResource($campaign);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $templateUuId = $request->get('template_uuid');
        $tagUuIds = $request->get('tag_uuids', []);
        $fromAddressUuid = $request->get('from_address_uuid');
        $scheduledAtInput = $request->get('scheduled_at');
        $subject = $request->string('subject', '');
        $preheaderText = $request->string('preheader_text', '');
        $replyTo = $request->string('reply_to', '');

        $campaignStoreService = new CampaignStoreService();
        $campaign = $campaignStoreService->storeCampaign(
            $templateUuId,
            $tagUuIds,
            $fromAddressUuid,
            $subject,
            $preheaderText,
            $replyTo,
            $scheduledAtInput
        );

        return response()->json(['data' => $campaign->loadCount('contacts')], 201);
    }

    public function destroy(Request $request, Campaign $campaign): JsonResponse
    {
        abort_if($campaign->company_id !== $request->user()->company_id, 403);

        $campaign->delete();

        return response()->json(['message' => 'Campaign deleted successfully.'], 204);
    }
}
