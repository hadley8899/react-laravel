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
            $table->string('fuel_type')->nullable();
            $table->string('fuel_type_1')->nullable();
            $table->string('engine_description')->nullable();
            $table->string('drive')->nullable();
            $table->string('engine_displacement')->nullable();
            $table->integer('cylinders')->nullable();
            $table->decimal('combined_mpg', 5, 2)->nullable();
            $table->boolean('base_model')->nullable();
            $table->boolean('start_stop')->nullable();
            $table->integer('year')->nullable();
            $table->string('transmission')->nullable();
            $table->timestamps();
            $table->unique(['vehicle_make_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_makes');
        Schema::dropIfExists('vehicle_models');
    }
};
