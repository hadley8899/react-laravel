<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_variables', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('friendly_name')->nullable(); // e.g. "Primary Color", "Email Logo"
            // e.g.  "PRIMARY_COLOR", "EMAIL_LOGO"
            $table->string('key', 64);

            // Store raw value (hex string, URL, plain text, etc.)
            $table->text('value')->nullable();

            // Optional helper fields
            $table->string('type', 32)->nullable();      // color, image, url, text …
            $table->json('meta')->nullable();            // anything extra

            $table->boolean('can_be_deleted')->default(true);

            $table->timestamps();

            $table->unique(['company_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variables');
    }
};
