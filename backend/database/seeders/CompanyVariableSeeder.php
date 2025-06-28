<?php

namespace Database\Seeders;

use App\Models\CompanyVariable;
use Illuminate\Database\Seeder;

class CompanyVariableSeeder extends Seeder
{
    private int $companyId;
    public function __construct(int $companyId)
    {
        // If a company ID is provided, you can store it for later use
        $this->companyId = $companyId;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            ['key' => 'PRIMARY_COLOR', 'value' => '#0A84FF', 'type' => 'color', 'friendly_name' => 'Primary Color'],
            ['key' => 'SECONDARY_COLOR', 'value' => '#FF7538', 'type' => 'color', 'friendly_name' => 'Secondary Color'],
            ['key' => 'EMAIL_LOGO', 'value' => null, 'type' => 'image', 'friendly_name' => 'Email Logo'],
            ['key' => 'FACEBOOK_URL', 'value' => null, 'type' => 'url', 'friendly_name' => 'Facebook URL'],
            ['key' => 'INSTAGRAM_URL', 'value' => null, 'type' => 'url', 'friendly_name' => 'Instagram URL'],
            ['key' => 'X_URL', 'value' => null, 'type' => 'url', 'friendly_name' => 'X (Twitter) URL'],
            ['key' => 'LINKEDIN_URL', 'value' => null, 'type' => 'url', 'friendly_name' => 'LinkedIn URL'],
        ];

        foreach ($defaults as $data) {
            $data['can_be_deleted'] = false;
            $data['company_id'] = $this->companyId ?? null;
            CompanyVariable::query()->create($data);
        }
    }
}
