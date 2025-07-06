<?php

namespace App\Http\Controllers;

use App\Http\Resources\VariableResource;
use App\Models\Company;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TemplateVariableController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        /** @var Company $company */
        $company = $request->user()->company;

        /* ---------- 1. Company variables ---------- */
        $companyVars = collect(Company::specialVariableDefinitions())
            ->map(fn($def) => [
                'friendly_name' => $def['friendly_name'],
                'key' => $def['key'],
                'type' => $def['type'],
                'scope' => 'company',
            ])
            ->concat(
                $company->variables()
                    ->orderBy('key')
                    ->get()
                    ->map(fn($v) => [
                        'friendly_name' => $v->friendly_name,
                        'key' => $v->key,
                        'type' => $v->type,
                        'scope' => 'company',
                    ])
            );

        /* ---------- 2. Customer variables ---------- */
        $customerBuiltIns = collect(Customer::specialVariableDefinitions())
            ->map(fn($def) => [
                'friendly_name' => $def['friendly_name'],
                'key' => $def['key'],
                'type' => $def['type'],
                'scope' => 'customer',
            ]);

        $customerCustoms = $company->contactCustomVariables()
            ->orderBy('key')
            ->get()
            ->map(fn($v) => [
                'friendly_name' => $v->friendly_name,
                'key' => 'CUSTOMER.' . $v->key,
                'type' => $v->type,
                'scope' => 'customer',
            ]);

        $all = $companyVars->concat($customerBuiltIns)->concat($customerCustoms);

        return VariableResource::collection($all);
    }
}
