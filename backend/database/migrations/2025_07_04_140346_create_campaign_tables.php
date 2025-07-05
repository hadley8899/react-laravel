<?php

use App\Enums\CampaignContactStatus;
use App\Enums\CampaignStatus;
use App\Enums\DomainStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sending_domains', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('domain')->unique();                 // news.customer.com
            $table->string('mailgun_id')->nullable();           // Mailgun’s numeric ID
            $table->string('state')->default(DomainStatus::Pending->value); // pending|active|failed
            $table->json('dns_records')->nullable();            // CNAME/TXT returned by Mailgun
            $table->timestamps();
        });

        Schema::create('from_addresses', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sending_domain_id')->constrained()->cascadeOnDelete();
            $table->string('local_part');          // e.g. marketing
            $table->string('name')->nullable();    // “Acme Marketing”
            $table->boolean('verified')->default(false);
            $table->timestamps();

            $table->unique(['sending_domain_id', 'local_part']); // marketing@news.customer.com
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('subject');
            $table->string('preheader_text')->nullable();
            $table->foreignId('from_address_id')
                ->nullable()
                ->constrained('from_addresses')
                ->nullOnDelete();
            $table
                ->foreignId('email_template_id')
                ->constrained('email_templates')
                ->cascadeOnDelete();
            $table->string('reply_to')->nullable();
            $table->json('contact_tag_ids');
            $table->string('status')->default(CampaignStatus::Draft->value);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });

        Schema::create('campaign_contacts', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default(CampaignContactStatus::Pending->value);
            $table->string('provider_message_id')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('clicked_at')->nullable();
            $table->timestamp('bounced_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['campaign_id', 'customer_id']);
        });

        Schema::create('campaign_events', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('campaign_contact_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // open | click | bounce | complaint
            $table->json('data')->nullable(); // raw webhook payload
            $table->timestamp('created_at'); // no updated_at needed
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('campaign_contacts');
        Schema::dropIfExists('campaign_events');
        Schema::dropIfExists('from_addresses');
    }
};
