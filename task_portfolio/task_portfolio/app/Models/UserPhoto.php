<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPhoto extends Model
{
    //1対１の関係
    public function name(){
        return $this->belongsTo('App\Models\UserName');
    }
}
