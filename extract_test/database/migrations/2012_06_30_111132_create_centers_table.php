<?php

use App\Enums\CenterStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCentersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('centers', function (Blueprint $table) {
            $table->id();
            $table->string('code', config('database.connections.mysql.default_key_len'))->unique();
            $table->string('name');
            $table->string('owner_name');
            $table->string('director_name')->nullable();
            $table->string('director_image')->nullable();
            $table->string('fathers_name')->nullable();
            $table->string('mothers_name')->nullable();
            $table->unsignedTinyInteger('religion')->nullable();
            $table->unsignedTinyInteger('gender')->nullable();
            $table->string('nationality')->nullable();
            $table->unsignedInteger('division');
            $table->unsignedInteger('district');
            $table->unsignedInteger('upazilla');
            $table->string('post_office')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('facebook_url')->nullable();
            $table->unsignedInteger('no_of_computers')->nullable();
            $table->string('institute_age')->nullable();
            $table->string('address')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('photo')->nullable();
            $table->string('authority_signature')->nullable();
            $table->string('nid_photo')->nullable();
            $table->string('nid_back_photo')->nullable();
            $table->string('trade_license')->nullable();
            $table->unsignedTinyInteger('status')->default(CenterStatus::Pending);
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
        Schema::dropIfExists('centers');
    }
}
