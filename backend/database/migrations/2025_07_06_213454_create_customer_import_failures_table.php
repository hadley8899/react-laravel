<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customer_import_failures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_import_id')
                ->constrained('customer_imports')
                ->cascadeOnDelete();

            $table->unsignedInteger('row_number');
            $table->json('row_data')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_import_failures');
    }
};
