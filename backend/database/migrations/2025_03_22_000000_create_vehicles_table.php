<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicles', static function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('customer_id');
            $table->string('make');
            $table->string('model');
            $table->year('year')->nullable();
            $table->string('registration');
            $table->enum('status', [
                'In Service',
                'Ready for Pickup',
                'Awaiting Parts',
                'Scheduled',
                'Diagnostic',
                'Complete',
            ])->default('Scheduled');
            $table->date('last_service')->nullable();
            $table->date('next_service_due')->nullable();
            $table->string('type')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['company_id', 'registration']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
