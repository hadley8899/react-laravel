<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->string('subject')->nullable();
            $table->string('preview_text')->nullable();
            $table->json('layout_json');
            $table->longText('html_cached')->nullable();
            $table->longText('text_cached')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->unique(['company_id', 'name']);
        });

        Schema::create('email_template_revisions', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('template_id')
                ->constrained('email_templates')
                ->cascadeOnDelete();
            $table->json('layout_json');
            $table->longText('html_cached')->nullable();
            $table->longText('text_cached')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('email_template_revisions');
    }

};
