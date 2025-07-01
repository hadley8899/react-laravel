<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Random\RandomException;

class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $hidden = ['id', 'logo_path', 'deleted_at'];

    protected $appends = ['logo_url'];

    protected $fillable = [
        'uuid',
        'name',
        'company_code',
        'slug',
        'address',
        'phone',
        'email',
        'website',
        'status',
        'logo_path',
        'country',
        'timezone',
        'currency',
        'tax_id',
        'registration_number',
        'industry',
        'plan',
        'trial_ends_at',
        'active_until',
        'locale',
        'default_units',
        'billing_address',
        'notes',
        'default_appointment_duration',
        'enable_online_booking',
        'send_appointment_reminders',
        'appointment_reminder_timing',
        'appointment_buffer_time',
        'min_booking_notice_hours',
        'invoice_prefix',
        'next_invoice_number',
        'default_payment_terms',
        'invoice_footer_notes',
        'setup_complete',
    ];

    protected $casts = [
        'enable_online_booking' => 'boolean',
        'send_appointment_reminders' => 'boolean',
        'default_appointment_duration' => 'integer',
        'appointment_buffer_time' => 'integer',
        'min_booking_notice_hours' => 'integer',
    ];

    /**
     * The "booted" method of the model.
     *
     * This method is called when the model is booting, and it's a great
     * place to register model event listeners.
     *
     * @return void
     */
    protected static function booted(): void
    {
        /**
         * Listen for the "creating" event on the Company model.
         * This event fires when a new model instance is being saved for the first time.
         * We use this to generate a unique company code if one hasn't been provided.
         */
        static::creating(static function (self $company) {
            if (empty($company->company_code)) {
                // Generate a unique code and assign it to the model.
                $company->company_code = self::generateUniqueCompanyCode($company->name);
            }

            if (empty($company->slug)) {
                // Generate a slug from the company name.
                $company->slug = str($company->name)->slug();
            }
        });
    }

    /**
     * Generates a unique company code.
     *
     * It creates a code based on the company name and a random number,
     * ensuring the generated code does not already exist in the database.
     *
     * @param string $name The name of the company.
     * @return string
     * @throws RandomException
     */
    private static function generateUniqueCompanyCode(string $name): string
    {
        // Take the first 3 characters of the name, make them uppercase.
        // Fallback to 'CMP' if the name is empty.
        $prefix = strtoupper(substr($name, 0, 3));
        if (empty($prefix)) {
            $prefix = 'CMP';
        }

        // Loop until we find a code that is not already in use.
        do {
            // Generate a random 6-digit number.
            $randomNumber = random_int(100000, 999999);
            $code = $prefix . '-' . $randomNumber;
        } while (self::query()->where('company_code', $code)->exists());

        return $code;
    }

    /**
     * @return string|null
     */
    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null;
    }

    /**
     * @return HasMany
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * @return HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return HasMany
     */
    public function variables(): HasMany
    {
        return $this->hasMany(CompanyVariable::class);
    }

    /**
     * Returns the list of special company variable definitions.
     * Each entry is an array with 'key', 'friendly_name', 'type', and optionally 'value'.
     */
    public static function specialVariableDefinitions(): array
    {
        return [
            [
                'key' => 'COMPANY_NAME',
                'friendly_name' => 'Company Name',
                'type' => 'text',
            ],
            [
                'key' => 'COMPANY_ADDRESS',
                'friendly_name' => 'Company Address',
                'type' => 'text',
            ],
            [
                'key' => 'COMPANY_PHONE',
                'friendly_name' => 'Company Phone',
                'type' => 'text',
            ],
            [
                'key' => 'COMPANY_EMAIL',
                'friendly_name' => 'Company Email',
                'type' => 'text',
            ],
            [
                'key' => 'COMPANY_WEBSITE',
                'friendly_name' => 'Company Website',
                'type' => 'text',
            ],
            [
                'key' => 'COMPANY_COUNTRY',
                'friendly_name' => 'Company Country',
                'type' => 'text',
            ],
            [
                'key' => 'COMPANY_REGISTRATION_NUMBER',
                'friendly_name' => 'Company Registration Number',
                'type' => 'text',
            ],
        ];
    }

    /**
     * Returns the special variable values for this company as an array keyed by variable key.
     */
    public function specialVariableValues(): array
    {
        return [
            'COMPANY_NAME' => $this->name,
            'COMPANY_ADDRESS' => $this->address,
            'COMPANY_PHONE' => $this->phone,
            'COMPANY_EMAIL' => $this->email,
            'COMPANY_WEBSITE' => $this->website,
            'COMPANY_COUNTRY' => $this->country,
            'COMPANY_REGISTRATION_NUMBER' => $this->registration_number,
        ];
    }
}
