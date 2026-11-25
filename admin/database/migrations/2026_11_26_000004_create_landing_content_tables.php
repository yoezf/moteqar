<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $t) {
            $t->id();
            $t->string('kind')->default('live'); // case = studi kasus with PDF, live = website/app that is live
            $t->string('title_id');
            $t->string('title_en');
            $t->string('industry_id')->nullable();
            $t->string('industry_en')->nullable();
            $t->text('overview_id')->nullable();
            $t->text('overview_en')->nullable();
            $t->json('highlights_id')->nullable();
            $t->json('highlights_en')->nullable();
            $t->json('tech')->nullable();
            $t->string('url')->nullable();
            $t->string('cover')->nullable();
            $t->unsignedSmallInteger('sort')->default(0);
            $t->boolean('published')->default(true);
            $t->timestamps();
        });

        Schema::create('build_items', function (Blueprint $t) {
            $t->id();
            $t->string('icon')->default('globe-alt');
            $t->string('title_id');
            $t->string('title_en');
            $t->text('desc_id')->nullable();
            $t->text('desc_en')->nullable();
            $t->unsignedSmallInteger('sort')->default(0);
            $t->boolean('published')->default(true);
            $t->timestamps();
        });

        Schema::create('faq_items', function (Blueprint $t) {
            $t->id();
            $t->string('question_id');
            $t->string('question_en');
            $t->text('answer_id');
            $t->text('answer_en');
            $t->unsignedSmallInteger('sort')->default(0);
            $t->boolean('published')->default(true);
            $t->timestamps();
        });

        Schema::create('plans', function (Blueprint $t) {
            $t->id();
            $t->string('code')->unique(); // starter, business, custom
            $t->string('name');
            $t->string('title_id');
            $t->string('title_en');
            $t->json('scope_id')->nullable();
            $t->json('scope_en')->nullable();
            $t->unsignedSmallInteger('sort')->default(0);
            $t->boolean('published')->default(true);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
        Schema::dropIfExists('faq_items');
        Schema::dropIfExists('build_items');
        Schema::dropIfExists('portfolio_items');
    }
};
