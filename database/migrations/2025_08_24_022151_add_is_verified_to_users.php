<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        // database/migrations/xxxx_add_is_verified_to_users.php
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false);
            $table->string('verification_code')->nullable();
            $table->timestamp('verification_expires_at')->nullable();
        });

    }

};
