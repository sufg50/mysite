<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserName extends Model
{
    //1対１の関係
    //has
    public function photos(){
        return $this->hasOne('App\Models\UserPhoto', 'id');
    }
    public function my_self_introductions(){
        return $this->hasOne('App\Models\MySelfIntroduction', 'id');
    }
}
