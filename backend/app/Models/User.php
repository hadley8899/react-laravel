<?php

namespace App\Models;

use App\Notifications\CustomResetPassword;
use App\Notifications\CustomVerifyEmail;
use App\Traits\HasUuid;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Random\RandomException;
use SensitiveParameter;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property-read Company|null $company
 * @property mixed|string $password
 * @property string $avatar_path
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUuid, Notifiable, HasApiTokens, HasRoles;

    protected $appends = ['avatar_url'];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'password',
        'avatar_path',
        'notify_new_booking',
        'notify_job_complete',
        'preferred_theme',
        'company_id',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialisation.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'id',
    ];

    public function loginActivity(): HasMany
    {
        return $this->hasMany(UserLoginActivity::class, 'user_id', 'id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notify_new_booking' => 'boolean',
            'notify_job_complete' => 'boolean',
        ];
    }

    /**
     * @return string|null
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null;
    }

    public function sendPasswordResetNotification(#[SensitiveParameter] $token): void
    {
        $this->notify(new CustomResetPassword($token));
    }

    /**
     * Override the notification for verifying email.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomVerifyEmail);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @throws RandomException
     */
    public static function createInvitationToken(): string
    {
        // As the invite code is unique, We need to make sure it doesn't already exist in the database
        do {
            $invitationCode = bin2hex(random_bytes(16)); // Generate a unique invitation code
        } while (self::query()->where('invitation_token', $invitationCode)->exists());

        return $invitationCode;
    }
}
