<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'availability')) {
                $table->dropColumn('availability');
            }
            $table->integer('stocks')->default(0)->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('stocks');
            $table->enum('availability', ['in-stock', 'out-of-stock'])->default('in-stock')->after('image');
        });
    }
};
