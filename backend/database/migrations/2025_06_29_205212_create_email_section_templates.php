<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_section_templates', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('type', 32)->unique();
            $table->string('title');
            $table->string('group')->default('Basics');
            $table->json('default_content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_section_templates');
    }
};
