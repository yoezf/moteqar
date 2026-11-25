<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('email');
            $t->string('company')->nullable();
            $t->string('service')->nullable();
            $t->string('budget')->nullable();
            $t->string('package')->nullable();
            $t->text('details');
            $t->string('source')->default('landing');
            $t->string('status')->default('new'); // new, contacted, proposal, won, lost
            $t->text('notes')->nullable();
            $t->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
