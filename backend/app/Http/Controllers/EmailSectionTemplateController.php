<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmailSectionTemplateResource;
use App\Models\CompanyVariable;
use App\Models\EmailSectionTemplate;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class EmailSectionTemplateController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $sections = EmailSectionTemplate::query()
            ->orderBy('type')
            ->get();

        $companyVariables = CompanyVariable::query()
            ->where('company_id', Auth::user()->company->id)
            ->get();

        $companyVariablesArray = $companyVariables->pluck('value', 'key')->toArray();

        foreach ($sections as $section) {
            $defaultContent = $section->default_content;
            $section->default_content = $this->replaceVariables($defaultContent, $companyVariablesArray);
        }

        return EmailSectionTemplateResource::collection($sections);
    }

    /**
     * Recursively replace variables in the content array/object.
     */
    private function replaceVariables($content, $variables)
    {
        if (is_array($content)) {
            foreach ($content as $key => $value) {
                $content[$key] = $this->replaceVariables($value, $variables);
            }
        } elseif (is_string($content)) {
            if (preg_match('/{{(.*?)}}/', $content, $matches)) {
                $variableKey = trim($matches[1]);
                if (array_key_exists($variableKey, $variables)) {
                    return str_replace(
                        "{{" . $variableKey . "}}",
                        $variables[$variableKey],
                        $content
                    );
                }
            }
        }
        return $content;
    }
}
