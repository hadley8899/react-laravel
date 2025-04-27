<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function user()
    {
        $user = auth()->user();
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        /* handle avatar */
        if ($request->hasFile('avatar')) {

            if ($user->avatar_path) Storage::delete($user->avatar_path);

            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar_path'] = $path;
        }

        $user->update($validated);

        return response()->json(['data' => $user->fresh()]);
    }

    /**
     * Change the user's password.
     *
     * @param ChangePasswordRequest $request
     * @param User $user
     * @return JsonResponse
     * @throws ValidationException
     */
    public function changePassword(ChangePasswordRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        // Verify the current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        // Update the password
        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}
