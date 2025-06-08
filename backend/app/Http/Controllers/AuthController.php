<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Notifications\PasswordUpdatedNotification;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController
{
    /**
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = User::query()->where('email', $request->email)->first();

            // Revoke previous tokens if you want
            $user->tokens()->delete();

            $token = $user->createToken('auth-token')->plainTextToken;

            // Update last login timestamp
            $user->update(['last_login_at' => Carbon::now()->toDateTimeString()]);

            // Record login activity
            $user->loginActivity()->create([
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'success' => 'success',
            ]);

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token
            ]);
        } else {
            $user = User::query()->where('email', $request->email)->first();
            if ($user) {
                // Record failed login attempt
                $user->loginActivity()->create([
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->header('User-Agent'),
                    'success' => 'failed',
                ]);
            }
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        // TODO Plan for register user/company
        // 1. User creates an user, With a company name
        // 2. We create the company with the name and a bunch of default settings
        // 3. We create the user with the company_id
        // 4. User then gets a verification email
        // 5. User clicks the link in the email to verify their email address
        // 6. Now the user will be presented with a setup page to fill in their company details, They cannot use the app
        // until they have completed the company setup
        // 7. Once the company setup is complete, the user can start using the app

        // Things to consider:
        // If we are adding a user to a company, we need to make sure that the company exists
        // We need a way to make sure the user is allowed to be a user on that company
        // We need to make sure that the user is not already registered with that email address
        // Maybe we create a company code (or something) if we are adding to an existing company
        // Maybe users on an existing company can register themselves, but they need to be approved by an admin first
        // Maybe we don't allow users to register themselves on an existing company, but they need to be invited by an admin first

        $user = User::query()->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'company_id' => 1, // Default company ID // TODO, This will need to be changed later
        ]);

        // Dispatch registered event to trigger verification email if needed
        event(new Registered($user));

        // Create token for the new user
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ], 201);
    }

    public function verifyEmail(Request $request): RedirectResponse
    {
        // From the route we have the id and hash
        $id = $request->route('id');
        $hash = $request->route('hash');

        $user = User::query()->findOrFail($id);

        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '?verified=1');
        }

        // Make sure the hash is valid
        if (!hash_equals((string)$hash, sha1($user->getEmailForVerification()))) {
            return redirect(env('FRONTEND_URL') . '?verified=0');
        }

        if ($user->markEmailAsVerified()) {
            return redirect(env('FRONTEND_URL') . '?verified=1');
        } else {
            return redirect(env('FRONTEND_URL') . '?verified=0');
        }
    }

    /**
     * @throws ValidationException
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Send the password reset link
        $user = User::query()->where('email', $request->email)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['No user found with this email address.'],
            ]);
        }

        // Create the password reset token
        $token = app('auth.password.broker')->createToken($user);
        // Send the email
        $user->sendPasswordResetNotification($token);

        return response()->json(['message' => 'Password reset link sent to your email.']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                // Send password updated notification
                $user->notify(new PasswordUpdatedNotification());

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password has been reset successfully'])
            : response()->json(['message' => __($status)], 400);
    }
}
