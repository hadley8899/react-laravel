<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tags', static function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->unsignedBigInteger('company_id');
            $table->string('name');
            $table->string('color', 7)->nullable();   // e.g. “#F87171”
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('company_id')
                ->references('id')->on('companies')
                ->cascadeOnDelete();
            $table->unique(['company_id', 'name']);   // Names unique per company
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
