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
        Schema::create('customer_tag', static function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();

            $table->foreign('customer_id')
                ->references('id')->on('customers')
                ->cascadeOnDelete();

            $table->foreign('tag_id')
                ->references('id')->on('tags')
                ->cascadeOnDelete();
        });
    }

    /**
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_tag');
    }
};
