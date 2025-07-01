<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmailTemplateResource;
use App\Models\EmailTemplate;
use App\Models\EmailTemplateRevision;
use App\Services\EmailTemplate\LayoutRenderer;
use App\Services\EmailTemplate\MjmlCompiler;
use App\Services\EmailTemplate\VariableInterpolator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreEmailTemplateRequest;
use App\Http\Requests\UpdateEmailTemplateRequest;

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
                perPage: $request->integer('per_page', 15),
                page: $request->integer('page', 1)
            );

        return EmailTemplateResource::collection($templates);
    }

    public function store(StoreEmailTemplateRequest $request): EmailTemplateResource
    {
        $this->authorize('store', EmailTemplate::class);

        $data = $request->validated();

        ['html' => $html, 'text' => $text] =
            app(MjmlCompiler::class)->compile(
                app(LayoutRenderer::class)
                    ->toMjml($data['layout_json'] ?? [])
            );

        $template = EmailTemplate::query()->create($data + [
                'company_id' => $request->user()->company_id,
                'created_by' => $request->user()->id,
                'html_cached' => $html,
                'text_cached' => $text,
            ]);

        // Initial revision
        $template->revisions()->create([
            'layout_json' => $template->layout_json,
            'html_cached' => $template->html_cached,
            'text_cached' => $template->text_cached,
            'created_by' => $request->user()->id,
        ]);

        return new EmailTemplateResource($template);
    }

    public function show(EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('view', $template);

        return new EmailTemplateResource($template);
    }

    public function update(UpdateEmailTemplateRequest $request, EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('update', $template);

        $data = $request->validated();

        DB::transaction(function () use ($template, $data, $request) {
            EmailTemplateRevision::query()->create([
                'template_id' => $template->id,
                'layout_json' => $template->layout_json,
                'html_cached' => $template->html_cached,
                'text_cached' => $template->text_cached,
                'created_by' => $request->user()->id,
            ]);

            ['html' => $html, 'text' => $text] =
                app(MjmlCompiler::class)->compile(
                    app(LayoutRenderer::class)
                        ->toMjml($template->layout_json)
                );

            $template->html_cached = $html;
            $template->text_cached = $text;

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
        $clone->name = $template->name . ' (copy)';
        $clone->company_id = Auth::user()->company->company_id;
        $clone->created_by = Auth::id();
        $clone->push();

        // Also clone a first revision
        $clone->revisions()->create([
            'layout_json' => $clone->layout_json,
            'html_cached' => $clone->html_cached,
            'text_cached' => $clone->text_cached,
            'created_by' => Auth::id(),
        ]);

        return new EmailTemplateResource($clone);
    }

    public function preview(
        EmailTemplate        $template,
        LayoutRenderer       $renderer,
        MjmlCompiler         $mjml,
        VariableInterpolator $vars
    ): JsonResponse
    {
        $this->authorize('view', $template);

        $mjmlMarkup = $renderer->toMjml($template->layout_json);

        $company = $template->company;
        $mjmlMarkup = $vars->interpolate($mjmlMarkup, $company);

        // ③ MJML → HTML/text
        ['html' => $html, 'text' => $text] = $mjml->compile($mjmlMarkup);

        return response()->json(compact('html', 'text'));
    }
}
