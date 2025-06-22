<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Models\Tag;

// ★ add
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\UnauthorizedException;

class CustomerTagController extends Controller
{
    /**
     * @throws AuthorizationException
     */
    public function sync(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('update', $customer);

        if ($customer->company_id !== Auth::user()->company->id) {
            throw new UnauthorizedException();
        }

        // uuids coming from the frontend
        $tagUuids = $request->input('tag_ids', []);

        // translate to numeric IDs that exist for this company
        $tagIds = Tag::query()
            ->where('company_id', $customer->company_id)
            ->whereIn('uuid', $tagUuids)
            ->pluck('id')
            ->all();

        $customer->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Tags updated',
            'customer' => new CustomerResource($customer->load('tags')),
        ]);
    }
}
