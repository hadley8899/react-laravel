<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Tag::class, 'tag');
    }

    public function index(): AnonymousResourceCollection
    {
        $tags = Tag::query()->where('company_id', Auth::user()->company->id)->get();
        return TagResource::collection($tags);
    }

    public function store(StoreTagRequest $request): TagResource
    {
        $validated = $request->validated();
        $validated['company_id'] = Auth::user()->company->id;

        $tag = Tag::query()->create($validated);
        return new TagResource($tag);
    }

    public function show(Tag $tag): TagResource
    {
        return new TagResource($tag);
    }

    public function update(UpdateTagRequest $request, Tag $tag): TagResource
    {
        $tag->update($request->validated());
        return new TagResource($tag->fresh());
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $tag->delete();
        return response()->json(null, 204);
    }

    /** Return customers associated with this tag */
    public function customers(Tag $tag): AnonymousResourceCollection
    {
        $tag->load(['customers.tags']);
        return CustomerResource::collection($tag->customers);
    }
}
