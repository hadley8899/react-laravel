<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmailTemplateResource;
use App\Models\EmailTemplate;
use App\Models\EmailTemplateRevision;
use App\Services\EmailTemplate\LayoutRenderer;
use App\Services\EmailTemplate\MjmlCompiler;
use App\Services\EmailTemplate\HtmlCompiler;
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
        $query = EmailTemplate::query()
            ->where('company_id', $request->user()->company_id);

        if ($search = $request->string('search')) {
            $like = '%' . $search . '%';
            $query->where(fn($q) => $q
                ->where('name', 'like', $like)
                ->orWhere('subject', 'like', $like)
                ->orWhere('preview_text', 'like', $like)
            );
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

    /* -----------------------------------------------------------------
     | Store
     |-----------------------------------------------------------------*/
    public function store(StoreEmailTemplateRequest $request): EmailTemplateResource
    {
        $this->authorize('store', EmailTemplate::class);

        $data = $request->validated();
        $user = $request->user();

        /* compile --------------------------------------------------- */
        ['html' => $html, 'text' => $text] = $data['type'] === 'builder'
            ? app(MjmlCompiler::class)->compile(
                app(LayoutRenderer::class)->toMjml($data['layout_json'])
            )
            : app(HtmlCompiler::class)->compile($data['html_source']);

        $template = EmailTemplate::query()->create($data + [
                'company_id' => $user->company_id,
                'created_by' => $user->id,
                'html_cached' => $html,
                'text_cached' => $text,
            ]);

        /* initial revision ----------------------------------------- */
        $template->revisions()->create([
            'layout_json' => $template->layout_json,
            'html_source' => $template->html_source,
            'html_cached' => $template->html_cached,
            'text_cached' => $template->text_cached,
            'created_by' => $user->id,
        ]);

        return new EmailTemplateResource($template);
    }

    /* -----------------------------------------------------------------
     | Show
     |-----------------------------------------------------------------*/
    public function show(EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('view', $template);

        return new EmailTemplateResource($template);
    }

    /* -----------------------------------------------------------------
     | Update
     |-----------------------------------------------------------------*/
    public function update(
        UpdateEmailTemplateRequest $request,
        EmailTemplate              $template
    ): EmailTemplateResource
    {
        $this->authorize('update', $template);
        $data = $request->validated();

        DB::transaction(function () use ($template, $data, $request) {
            /* save current revision */
            EmailTemplateRevision::query()->create([
                'template_id' => $template->id,
                'layout_json' => $template->layout_json,
                'html_source' => $template->html_source,
                'html_cached' => $template->html_cached,
                'text_cached' => $template->text_cached,
                'created_by' => $request->user()->id,
            ]);

            /* apply incoming changes */
            $template->fill($data);

            /* re-compile if source changed or forced */
            if ($template->isDirty(['layout_json', 'html_source', 'type'])) {
                ['html' => $html, 'text' => $text] = $template->type === 'builder'
                    ? app(MjmlCompiler::class)->compile(
                        app(LayoutRenderer::class)->toMjml($template->layout_json)
                    )
                    : app(HtmlCompiler::class)->compile($template->html_source);

                $template->html_cached = $html;
                $template->text_cached = $text;
            }

            $template->save();

            /* keep last 5 revisions */
            $template->revisions()
                ->latest('id')
                ->skip(5)
                ->take(PHP_INT_MAX)
                ->delete();
        });

        return new EmailTemplateResource($template);
    }

    /* -----------------------------------------------------------------
     | Destroy
     |-----------------------------------------------------------------*/
    public function destroy(EmailTemplate $template): JsonResponse
    {
        $this->authorize('delete', $template);
        $template->delete();

        return response()->json([], 204);
    }

    /* -----------------------------------------------------------------
     | Duplicate
     |-----------------------------------------------------------------*/
    public function duplicate(EmailTemplate $template): EmailTemplateResource
    {
        $this->authorize('create', EmailTemplate::class);

        $clone = $template->replicate([
            'type',
            'name',
            'subject',
            'preview_text',
            'layout_json',
            'html_source',
            'html_cached',
            'text_cached',
        ]);
        $clone->name = $template->name . ' (copy)';
        $clone->company_id = Auth::user()->company_id;
        $clone->created_by = Auth::id();
        $clone->push();

        $clone->revisions()->create([
            'layout_json' => $clone->layout_json,
            'html_source' => $clone->html_source,
            'html_cached' => $clone->html_cached,
            'text_cached' => $clone->text_cached,
            'created_by' => Auth::id(),
        ]);

        return new EmailTemplateResource($clone);
    }

    /* -----------------------------------------------------------------
     | Preview
     |-----------------------------------------------------------------*/
    public function preview(
        EmailTemplate        $template,
        LayoutRenderer       $renderer,
        MjmlCompiler         $mjml,
        HtmlCompiler $htmlCompiler,
        VariableInterpolator $vars
    ): JsonResponse
    {
        $this->authorize('view', $template);

        if ($template->type === 'builder') {
            $mjmlMarkup = $renderer->toMjml($template->layout_json);
            $company = $template->company;
            $mjmlMarkup = $vars->interpolate($mjmlMarkup, $company);
            ['html' => $html, 'text' => $text] = $mjml->compile($mjmlMarkup);
        } else {
            ['html' => $html, 'text' => $text] = $htmlCompiler->compile($template->html_source);
            $company = $template->company;
            $html = $vars->interpolate($html, $company);
            $text = $vars->interpolate($text, $company);
        }

        return response()->json(compact('html', 'text'));
    }
}
