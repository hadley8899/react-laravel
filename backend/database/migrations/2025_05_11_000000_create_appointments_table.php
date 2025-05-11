<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', static function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->bigInteger('customer_id')->unsigned()->index();
            $table->bigInteger('company_id')->unsigned()->index();
            $table->bigInteger('vehicle_id')->unsigned()->index();

            $table->string('service_type');
            $table->dateTime('date_time');
            $table->unsignedSmallInteger('duration_minutes')->default(60);

            $table->string('status')->default('Scheduled');
            $table->string('mechanic_assigned')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // one company can’t double-book the same slot for the same vehicle
            $table->unique(['company_id', 'vehicle_id', 'date_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
