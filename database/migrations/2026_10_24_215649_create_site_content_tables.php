<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('key')->unique();
            $table->json('value');
            $table->timestamps();
        });
        Schema::create('content_items', function (Blueprint $table): void {
            $table->id();
            $table->string('collection', 32);
            $table->string('slug', 160);
            $table->json('data');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('published')->default(false);
            $table->timestamps();
            $table->unique(['collection', 'slug']);
            $table->index(['collection', 'published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_items');
        Schema::dropIfExists('site_settings');
    }
};
