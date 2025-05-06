<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', static function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->string('website')->nullable();
            $table->enum('status', ['Active', 'Inactive', 'Pending'])->default('Active');

            $table->string('logo_path')->nullable();

            $table->string('country', 64)->nullable();        // ISO-3166 alpha-2
            $table->string('timezone')->nullable();
            $table->char('currency', 3)->nullable();         // ISO-4217
            $table->string('tax_id')->nullable();
            $table->string('registration_number')->nullable();

            $table->string('industry')->nullable();

            $table->enum('plan', ['Free','Pro','Enterprise'])->default('Free');
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('active_until')->nullable();

            $table->string('locale', 5)->nullable();
            $table->enum('default_units', ['metric','imperial'])->default('metric');

            $table->text('billing_address')->nullable();
            $table->text('notes')->nullable();

            $table->integer('default_appointment_duration')->default(60); // Default 60 minutes
            $table->boolean('enable_online_booking')->default(true);
            $table->boolean('send_appointment_reminders')->default(true);
            $table->string('appointment_reminder_timing', 10)->default('24h'); // e.g., '1h', '24h'
            // Optional: Add buffer time (in minutes)
            $table->integer('appointment_buffer_time')->default(0); // Time before/after unavailable
            // Optional: Minimum booking notice (in hours)
            $table->integer('min_booking_notice_hours')->default(24);

            $table->string('invoice_prefix')->default('INV-');
            $table->unsignedBigInteger('next_invoice_number')->default(1);
            $table->enum('default_payment_terms', ['DueOnReceipt','Net7','Net15','Net30'])->default('Net15');
            $table->text('invoice_footer_notes')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
