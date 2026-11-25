<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->string('role')->default('admin');                       // admin | client
            $t->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
        });
        Schema::table('project_notes', function (Blueprint $t) {
            $t->boolean('is_public')->default(false);                   // shown to the client in the portal
        });
    }

    public function down(): void
    {
        Schema::table('project_notes', fn (Blueprint $t) => $t->dropColumn('is_public'));
        Schema::table('users', function (Blueprint $t) {
            $t->dropConstrainedForeignId('client_id');
            $t->dropColumn('role');
        });
    }
};
