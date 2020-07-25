<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForumContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forum_contents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('forum_title',50);
            $table->string('forum_content',50);
            //投稿者名。（デフォルトで）NULL値をカラムに挿入する
            $table->string('poster_name',50)->nullable($value = true);
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
        Schema::dropIfExists('forum_contents');
    }
}
