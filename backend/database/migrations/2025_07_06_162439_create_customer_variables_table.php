<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        /* ------------------------------------------------------------
         |  A. Field definitions – one per company
         | ------------------------------------------------------------ */
        Schema::create('contact_custom_variables', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');

            $table->string('key');              // COUNT_OF_GOATS
            $table->string('friendly_name');    // "Count of goats on farm"
            $table->string('type')->default('text');  // text | image
            $table->json('meta')->nullable();

            $table->timestamps();

            $table->unique(['company_id', 'key']);
        });

        /* ------------------------------------------------------------
         |  B. Per-customer values – one row per customer × field
         | ------------------------------------------------------------ */
        Schema::create('contact_custom_variable_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('custom_variable_id')
                ->constrained('contact_custom_variables')
                ->onDelete('cascade');

            $table->text('value')->nullable();
            $table->json('meta')->nullable();

            $table->timestamps();

            // shorter explicit index name
            $table->unique(['customer_id', 'custom_variable_id'], 'ccv_customer_var_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_custom_variable_values');
        Schema::dropIfExists('contact_custom_variables');
    }
};
