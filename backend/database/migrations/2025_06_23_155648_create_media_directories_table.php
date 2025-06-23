<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_directories', static function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->foreignId('company_id')->constrained()->cascadeOnDelete();

            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('media_directories')
                ->cascadeOnDelete();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('name');

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'parent_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_directories');
    }
};
