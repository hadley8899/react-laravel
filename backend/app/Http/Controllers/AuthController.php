<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptInvitationRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\User;
use App\Notifications\NewUserRegistered;
use App\Notifications\PasswordUpdatedNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class AuthController
{
    /**
     * @throws ValidationException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // If the user
        if (Auth::attempt($request->only('email', 'password'))) {
            // User must be verified
            $user = User::query()
                ->where('email', $request->email)
                ->whereNotNull('email_verified_at')
                ->where('status', 'active')
                ->with(['company', 'roles'])
                ->first();

            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => ['Your account is not active or not verified.'],
                ]);
            }

            // Check if the user's company is active
            if ($user->company->status !== 'Active') {
                throw ValidationException::withMessages([
                    'company' => ['Your company account is not active. Please contact support.'],
                ]);
            }

            if ($user->company->plan === 'Free' && $user->company->trial_ends_at && $user->company->trial_ends_at < Carbon::now()) {
                throw ValidationException::withMessages([
                    'company' => ['Your company has exceeded the trial period. Please upgrade your plan.'],
                ]);
            }

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
                'token' => $token,
            ]);
        }

        $user = User::query()->where('email', $request->email)->first();
        if ($user) {
            // Record failed login attempt
            $user->loginActivity()->create([
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'success' => 'failed',
            ]);
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
        return DB::transaction(static function () use ($request) {
            if ($request->filled('company_code')) {
                $company = Company::query()
                    ->where('company_code', $request->company_code)
                    ->firstOrFail();

                $userStatus = 'pending';
                $userRole = 'User';
            } else {
                $company = Company::query()->create([
                    'name' => $request->company_name,
                    'email' => $request->email,
                    'setup_complete' => false,
                ]);
                $userStatus = 'active';
                $userRole = 'Admin';
            }

            $user = User::query()->create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'company_id' => $company->id,
                'status' => $userStatus,
            ])->assignRole($userRole);

            if ($userStatus === 'pending') {
                $admins = $company->users()->role(['Admin', 'Manager', 'Owner'])->get();
                Notification::send($admins, new NewUserRegistered($user, $company));
            }

            event(new Registered($user));

            return response()->json([
                'success' => true,
                'company_code' => $company->company_code,
                'message' => $userStatus === 'active'
                    ? 'Company created! You’re the owner—invite your team from Settings.'
                    : 'Registration submitted. An admin will approve your account shortly.',
            ], 201);
        });
    }

    public function verifyEmail(Request $request): RedirectResponse
    {
        // From the route we have the id and hash
        $id = $request->route('id');
        $hash = $request->route('hash');

        $user = User::query()->findOrFail($id);

        if ($user === null) {
            return redirect(env('FRONTEND_URL') . '?verified=0');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '?verified=1');
        }

        // Make sure the hash is valid
        if (!hash_equals((string)$hash, sha1($user->getEmailForVerification()))) {
            return redirect(env('FRONTEND_URL') . '?verified=0');
        }

        if ($user->markEmailAsVerified()) {
            return redirect(env('FRONTEND_URL') . '?verified=1');
        }

        return redirect(env('FRONTEND_URL') . '?verified=0');
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
            static function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
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

    public function acceptInvitation(AcceptInvitationRequest $request): JsonResponse
    {
        $user = User::query()
            ->where('invitation_token', $request->token)
            ->where('status', 'invited')
            ->firstOrFail();

        $user->forceFill([
            'password' => Hash::make($request->password),
            'invitation_token' => null,
            'status' => 'active',
            'email_verified_at' => now(),              // save a click
        ])->save();

        // If you’d like to auto-login on success, just create a token here:
        // $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'message' => 'Invitation accepted – you can sign in now.',
            // 'token' => $token,           // uncomment if auto-logging-in
        ]);
    }
}
