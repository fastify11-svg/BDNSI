<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            if (! Schema::hasColumn('centers', 'center_location')) {
                $table->text('center_location')->nullable()->after('address');
            }
            if (! Schema::hasColumn('centers', 'center_logo')) {
                $table->string('center_logo')->nullable()->after('photo');
            }
            if (! Schema::hasColumn('centers', 'director_photo')) {
                $table->string('director_photo')->nullable()->after('center_logo');
            }
            if (! Schema::hasColumn('centers', 'director_signature')) {
                $table->string('director_signature')->nullable()->after('director_photo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('centers', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('centers', 'center_location')) {
                $columns[] = 'center_location';
            }
            if (Schema::hasColumn('centers', 'center_logo')) {
                $columns[] = 'center_logo';
            }
            if (Schema::hasColumn('centers', 'director_photo')) {
                $columns[] = 'director_photo';
            }
            if (Schema::hasColumn('centers', 'director_signature')) {
                $columns[] = 'director_signature';
            }
            if (! empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
