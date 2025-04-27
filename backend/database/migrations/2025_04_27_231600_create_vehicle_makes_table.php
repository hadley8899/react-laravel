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
        Schema::create('vehicle_makes', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('vehicle_models', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('vehicle_make_id')->constrained('vehicle_makes')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();

            // Each model name should be unique within a make
            $table->unique(['vehicle_make_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_makes');
        Schema::dropIfExists('vehicle_models');
    }
};
