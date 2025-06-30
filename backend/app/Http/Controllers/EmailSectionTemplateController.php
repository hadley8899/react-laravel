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
            foreach ($defaultContent as $key => $value) {
                if (is_string($value) && preg_match('/{{(.*?)}}/', $value, $matches)) {
                    $variableKey = trim($matches[1]);
                    if (array_key_exists($variableKey, $companyVariablesArray)) {
                        $defaultContent[$key] = str_replace(
                            "{{" . $variableKey . "}}",
                            $companyVariablesArray[$variableKey],
                            $value
                        );
                    }
                }
            }
            $section->default_content = $defaultContent;
        }

        return EmailSectionTemplateResource::collection($sections);
    }
}
