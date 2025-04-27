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
        Schema::create('companies', function (Blueprint $table) {
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
