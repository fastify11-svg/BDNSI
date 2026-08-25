<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommissionPoliciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commission_policies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('value', 10, 2);
            $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete(); // if specific to staff
            $table->string('product_type')->nullable(); // e.g. registration
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('commission_policies');
    }
}
