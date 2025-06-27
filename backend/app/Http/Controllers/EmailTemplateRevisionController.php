<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use App\Models\EmailTemplateRevision;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmailTemplateRevisionController extends Controller
{
    /** GET /templates/{template}/revisions */
    public function index(EmailTemplate $template)
    {
        $this->authorize('view', $template);

        return response()->json(
            $template->revisions()
                ->with('creator:id,name,email')
                ->latest('id')
                ->take(5)
                ->get()
        );
    }

    /** POST /templates/{template}/revisions/{revision}/restore */
    public function restore(EmailTemplate $template, EmailTemplateRevision $revision)
    {
        $this->authorize('update', $template);

        abort_unless($revision->template_id === $template->id, 404);

        DB::transaction(function () use ($template, $revision) {
            // snapshot current state
            $template->revisions()->create([
                'layout_json' => $template->layout_json,
                'html_cached' => $template->html_cached,
                'text_cached' => $template->text_cached,
                'created_by'  => Auth::id(),
            ]);

            // restore old state
            $template->update([
                'layout_json' => $revision->layout_json,
                'html_cached' => $revision->html_cached,
                'text_cached' => $revision->text_cached,
            ]);

            // keep only last 5
            $template->revisions()->latest('id')->skip(5)->delete();
        });

        return response()->json($template->fresh());
    }
}
