<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyVariableRequest;
use App\Http\Requests\UpdateCompanyVariableRequest;
use App\Http\Resources\CompanyVariableResource;
use App\Models\CompanyVariable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        $company    = $request->user()->company;
        $validated  = $request->validated();
        $validated['company_id'] = $company->id;

        if (($validated['type'] ?? null) === 'image' && $request->hasFile('value')) {
            $path = $request->file('value')
                ->store("company-$company->uuid", 'variables');
            $validated['value'] = $path;
        }

        $variable = CompanyVariable::query()->create($validated);

        return new CompanyVariableResource($variable);
    }

    public function show(CompanyVariable $variable): CompanyVariableResource
    {
        $this->authorizeAccount($variable);

        return new CompanyVariableResource($variable);
    }

    public function update(
        UpdateCompanyVariableRequest $request,
        CompanyVariable $companyVariable
    ): CompanyVariableResource {
        $this->authorizeAccount($companyVariable);

        $data = $request->validated();

        /* swap out file if a new image is uploaded  */
        if (($companyVariable->type === 'image' || ($data['type'] ?? '') === 'image')
            && $request->hasFile('value')) {

            // delete old file if it exists
            if ($companyVariable->value && Storage::disk('variables')->exists($companyVariable->value)) {
                Storage::disk('variables')->delete($companyVariable->value);
            }

            $data['value'] = $request->file('value')
                ->store("company-{$companyVariable->company->uuid}", 'variables');
        }

        $companyVariable->update($data);

        return new CompanyVariableResource($companyVariable);
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
