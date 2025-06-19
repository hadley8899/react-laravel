<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignCompanyUserPermissionsRequest;
use App\Http\Requests\AssignCompanyUserRolesRequest;
use App\Http\Requests\StoreCompanyUserRequest;
use App\Http\Requests\UpdateCompanyUserRequest;
use App\Http\Requests\UpdateCompanyUserStatusRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Notifications\NewUserInvite;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Random\RandomException;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CompanyUserManagementController extends Controller
{
    /**
     * Display a listing of users in the company.
     * @throws AuthorizationException
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->where('company_id', Auth::user()->company->id)
            ->where('id', '!=', Auth::user()->id)
            ->with(['roles', 'permissions'])
            ->get();

        return UserResource::collection($users);
    }

    /**
     * Store a newly created user in storage.
     * @throws RandomException
     */
    public function store(StoreCompanyUserRequest $request): UserResource
    {
        // Generate a random 32 character string for the password
        $password = bin2hex(random_bytes(16));

        $invitationToken = User::createInvitationToken();
        $companyId = Auth::user()->company->id;

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($password);
        $user->company_id = $companyId;
        $user->status = 'invited'; // Default status for new users that have been created by a company admin/manager
        $user->invitation_token = $invitationToken; // Store the invitation token
        $user->save();

        if ($request->has('role')) {
            $user->assignRole($request->role);
        }

        // Send the invitation email to the user
        Notification::send($user, new NewUserInvite($user, Auth::user()->company));

        return new UserResource($user);
    }

    /**
     * Display the specified user.
     * @throws AuthorizationException
     */
    public function show(User $user): UserResource|JsonResponse
    {
        $this->authorize('view', $user);

        if ($user->company_id !== Auth::user()->company->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return new UserResource($user);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateCompanyUserRequest $request, User $user): UserResource
    {
        // Get validated data and update user attributes
        $data = $request->validated();

        // Update basic user fields
        $user->fill(array_intersect_key($data, array_flip(['name', 'email', 'status'])));
        $user->save();

        // Handle role assignment
        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return new UserResource($user);
    }

    /**
     * Remove the specified user from storage.
     * @throws AuthorizationException
     */
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        if ($user->company_id !== Auth::user()->company->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'You cannot delete your own account'], 422);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Update the user's status.
     */
    public function updateStatus(UpdateCompanyUserStatusRequest $request, User $user): UserResource
    {
        $user->status = $request->status;
        $user->save();

        return new UserResource($user);
    }

    /**
     * Get available roles.
     * @throws AuthorizationException
     */
    public function getAvailableRoles(): JsonResponse
    {
        $this->authorize('viewRoles', User::class);

        $roles = Role::all()->pluck('name');
        return response()->json(['data' => $roles]);
    }

    /**
     * Get available permissions.
     * @throws AuthorizationException
     */
    public function getAvailablePermissions(): JsonResponse
    {
        $this->authorize('viewPermissions', User::class);

        $permissions = Permission::all()->pluck('name');
        return response()->json(['data' => $permissions]);
    }

    /**
     * Assign roles to user.
     */
    public function assignRoles(AssignCompanyUserRolesRequest $request, User $user): UserResource
    {
        $user->syncRoles($request->roles);
        return new UserResource($user);
    }

    /**
     * Assign permissions to user.
     */
    public function assignPermissions(AssignCompanyUserPermissionsRequest $request, User $user): UserResource
    {
        $user->syncPermissions($request->permissions);
        return new UserResource($user);
    }
}
