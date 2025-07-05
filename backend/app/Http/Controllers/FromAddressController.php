<?php

namespace App\Http\Controllers;

use App\Enums\DomainStatus;
use App\Http\Requests\StoreFromAddressRequest;
use App\Http\Resources\FromAddressResource;
use App\Models\SendingDomain;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class FromAddressController extends Controller
{
    public function verified(): AnonymousResourceCollection
    {
        $rows = Auth::user()
            ->company
            ->fromAddresses()
            ->where('verified', true)
            ->whereRelation('sendingDomain', 'state', 'active')
            ->get();

        return FromAddressResource::collection($rows);
    }

    public function index(SendingDomain $sendingDomain): AnonymousResourceCollection
    {
        $this->authorizeDomain($sendingDomain);

        return FromAddressResource::collection(
            $sendingDomain->fromAddresses()->get()
        );
    }

    /* create */
    public function store(StoreFromAddressRequest $req, SendingDomain $sendingDomain): FromAddressResource
    {
        $this->authorizeDomain($sendingDomain);

        $fa = $sendingDomain->fromAddresses()->create([
            'company_id' => $sendingDomain->company_id,
            'local_part' => $req->local_part,
            'name' => $req->name,
            'verified' => $sendingDomain->state === DomainStatus::Active,
        ]);

        return new FromAddressResource($fa);
    }

    private function authorizeDomain(SendingDomain $domain): void
    {
        abort_if($domain->company_id !== auth()->user()->company_id, 403,
            'You do not have permission to access this sending domain.'
        );
    }
}
