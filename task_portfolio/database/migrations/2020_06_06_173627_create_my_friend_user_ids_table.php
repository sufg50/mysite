<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMyFriendUserIdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('my_friend_user_ids', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('my_friend_user_id');
            $table->string('yes_or_no',5);
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
        Schema::dropIfExists('my_friend_user_ids');
    }
}
