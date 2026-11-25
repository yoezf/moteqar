<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Files shared between the team and the client (brief from the client, deliverables from the team).
        Schema::create('project_files', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->boolean('from_client')->default(false);
            $t->string('name');
            $t->string('path');
            $t->unsignedBigInteger('size')->default(0);
            $t->timestamps();
        });

        // Invoices / payment milestones shown to the client.
        Schema::create('payments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->string('title');                               // e.g. "DP 50%"
            $t->unsignedBigInteger('amount');                  // rupiah
            $t->date('due_date')->nullable();
            $t->string('status')->default('unpaid');           // unpaid | paid
            $t->date('paid_at')->nullable();
            $t->text('note')->nullable();                      // bank transfer details, etc.
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('project_files');
    }
};
