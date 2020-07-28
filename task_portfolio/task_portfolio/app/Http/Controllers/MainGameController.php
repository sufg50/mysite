<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MainGame;
use App\Models\UserName;
use App\Models\UserPhoto;



class MainGameController extends Controller
{
    //
    public function index()
    {

        //Authはファサードなのでuseが必要
        $id = Auth::id();
        $contact = UserName::find($id);
        $name = $contact->user_name;

        $user_p = UserPhoto::find($id);
        $photo = $user_p->user_photo;
        


        return view('game.index');
    }

}
