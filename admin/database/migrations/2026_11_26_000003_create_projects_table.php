<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $t) {
            $t->id();
            $t->foreignId('client_id')->constrained()->cascadeOnDelete();
            $t->foreignId('lead_id')->nullable()->constrained()->nullOnDelete();
            $t->string('title');
            $t->string('service')->nullable();
            $t->text('requirements')->nullable();      // what the client wants
            $t->json('attachments')->nullable();       // brief, designs, contracts
            $t->unsignedBigInteger('agreed_price')->nullable(); // rupiah
            $t->date('deadline')->nullable();
            $t->string('status')->default('consultation'); // consultation, quotation, development, revision, done, cancelled
            $t->timestamps();
        });

        Schema::create('project_notes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->text('body');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_notes');
        Schema::dropIfExists('projects');
    }
};
