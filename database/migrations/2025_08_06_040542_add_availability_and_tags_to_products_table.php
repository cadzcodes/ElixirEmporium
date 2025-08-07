<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->enum('availability', ['in-stock', 'out-of-stock'])->default('in-stock')->after('image');
            $table->json('tags')->nullable()->after('availability');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('availability');
            $table->dropColumn('tags');
        });
    }
};
