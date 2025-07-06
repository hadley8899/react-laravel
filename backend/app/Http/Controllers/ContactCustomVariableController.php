<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactCustomVariableRequest;
use App\Http\Requests\UpdateContactCustomVariableRequest;
use App\Http\Resources\ContactCustomVariableResource;
use App\Models\ContactCustomVariable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class ContactCustomVariableController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $variables = ContactCustomVariable::query()
            ->where('company_id', $request->user()->company_id)
            ->orderBy('key')
            ->get();

        return ContactCustomVariableResource::collection($variables);
    }

    public function store(StoreContactCustomVariableRequest $request): ContactCustomVariableResource
    {
        $data = $request->validated();
        $data['company_id'] = $request->user()->company_id;

        $variable = ContactCustomVariable::create($data);

        return new ContactCustomVariableResource($variable);
    }

    public function show(ContactCustomVariable $customVariable): ContactCustomVariableResource
    {
        $this->authorizeCompany($customVariable);

        return new ContactCustomVariableResource($customVariable);
    }

    public function update(
        UpdateContactCustomVariableRequest $request,
        ContactCustomVariable              $customVariable
    ): ContactCustomVariableResource
    {
        $this->authorizeCompany($customVariable);

        $customVariable->update($request->validated());

        return new ContactCustomVariableResource($customVariable);
    }

    public function destroy(ContactCustomVariable $customVariable)
    {
        $this->authorizeCompany($customVariable);

        $customVariable->delete();

        return response()->noContent();
    }

    private function authorizeCompany(ContactCustomVariable $variable): void
    {
        if ($variable->company_id !== Auth::user()->company_id) {
            abort(403, 'This variable does not belong to your company.');
        }
    }
}
