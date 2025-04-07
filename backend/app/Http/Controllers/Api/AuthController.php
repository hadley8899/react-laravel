<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Notifications\PasswordUpdatedNotification;
use Illuminate\Auth\Events\PasswordReset;
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

            return response()->json([
                'user' => $user,
                'token' => $token
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
