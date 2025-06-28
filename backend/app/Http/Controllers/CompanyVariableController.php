<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyVariableRequest;
use App\Http\Requests\UpdateCompanyVariableRequest;
use App\Http\Resources\CompanyVariableResource;
use App\Models\CompanyVariable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CompanyVariableController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $variables = $request->user()
            ->company
            ->variables()
            ->orderBy('key')
            ->get();

        return CompanyVariableResource::collection($variables);
    }

    public function store(StoreCompanyVariableRequest $request): CompanyVariableResource
    {
        $company = $request->user()->company;

        $validated = $request->validated();
        $validated['company_id'] = $company->id;

        $request->validate([
            'key' => Rule::unique('company_variables', 'key')
                ->where('company_id', $company->id),
        ]);

        $variable = CompanyVariable::query()->create($validated);

        return new CompanyVariableResource($variable);
    }

    public function show(CompanyVariable $variable): CompanyVariableResource
    {
        $this->authorizeAccount($variable);

        return new CompanyVariableResource($variable);
    }

    public function update(UpdateCompanyVariableRequest $request, CompanyVariable $variable): CompanyVariableResource
    {
        $this->authorizeAccount($variable);

        $variable->update($request->validated());

        return new CompanyVariableResource($variable);
    }

    public function destroy(CompanyVariable $variable)
    {
        $this->authorizeAccount($variable);

        $variable->delete();

        return response()->noContent();
    }

    private function authorizeAccount(CompanyVariable $companyVariable): void
    {
        $companyId = Auth::user()->company->id;
        if ($companyVariable->company_id !== $companyId) {
            abort(403, 'This variable does not belong to your account.');
        }
    }

}
