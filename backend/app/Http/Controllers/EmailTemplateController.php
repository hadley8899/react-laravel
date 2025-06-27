<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmailTemplateResource;
use App\Models\EmailTemplate;
use App\Models\EmailTemplateRevision;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmailTemplateController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = EmailTemplate::query()->where('company_id', $request->user()->company_id);

        if ($search = $request->string('search')) {
            $query->where(function ($q) use ($search) {
                $like = '%' . $search . '%';
                $q->where('name', 'like', $like)
                    ->orWhere('subject', 'like', $like)
                    ->orWhere('preview_text', 'like', $like);
            });
        }

        $templates = $query
            ->with('creator:id,name,email')
            ->latest()
            ->paginate(
                perPage:  $request->integer('per_page', 15),
                page:     $request->integer('page', 1)
            );

        return EmailTemplateResource::collection($templates);
    }

    public function store(Request $request): EmailTemplateResource
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'subject'      => 'nullable|string|max:255',
            'preview_text' => 'nullable|string|max:255',
            'layout_json'  => 'required|array',
        ]);

        $template = EmailTemplate::create($data + [
                'company_id' => $request->user()->company_id,
                'created_by' => $request->user()->id,
            ]);

        // Initial revision
        $template->revisions()->create([
            'layout_json' => $template->layout_json,
            'created_by'  => $request->user()->id,
        ]);

        return new EmailTemplateResource($template);
    }

    public function show(EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('view', $template);

        return new EmailTemplateResource($template);
    }

    public function update(Request $request, EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('update', $template);

        $data = $request->validate([
            'name'         => 'sometimes|required|string|max:255',
            'subject'      => 'sometimes|nullable|string|max:255',
            'preview_text' => 'sometimes|nullable|string|max:255',
            'layout_json'  => 'sometimes|required|array',
            'html_cached'  => 'sometimes|nullable|string',
            'text_cached'  => 'sometimes|nullable|string',
        ]);

        DB::transaction(function () use ($template, $data, $request) {
            EmailTemplateRevision::query()->create([
                'template_id' => $template->id,
                'layout_json' => $template->layout_json,
                'html_cached' => $template->html_cached,
                'text_cached' => $template->text_cached,
                'created_by'  => $request->user()->id,
            ]);

            $template->update($data);

            // Keep only last 5 revisions
            $template->revisions()
                ->latest('id')
                ->skip(5)
                ->take(PHP_INT_MAX)
                ->delete();
        });

        return new EmailTemplateResource($template);
    }

    public function destroy(EmailTemplate $template): JsonResponse
    {
        $this->authorize('delete', $template);

        $template->delete();

        return response()->json([], 204);
    }

    public function duplicate(EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('create', EmailTemplate::class);

        $clone = $template->replicate([
            'name',
            'subject',
            'preview_text',
            'layout_json',
            'html_cached',
            'text_cached',
        ]);
        $clone->name       = $template->name . ' (copy)';
        $clone->company_id = Auth::user()->company->company_id;
        $clone->created_by = Auth::id();
        $clone->push();

        // Also clone a first revision
        $clone->revisions()->create([
            'layout_json' => $clone->layout_json,
            'html_cached' => $clone->html_cached,
            'text_cached' => $clone->text_cached,
            'created_by'  => Auth::id(),
        ]);

        return new EmailTemplateResource($clone);
    }

    public function preview(EmailTemplate $template): JsonResponse
    {
        // In the future we will need to merge in the company's variables, But no now...
        $this->authorize('view', $template);

        return response()->json([
            'html'  => $template->html_cached,
            'text'  => $template->text_cached,
        ]);
    }
}
