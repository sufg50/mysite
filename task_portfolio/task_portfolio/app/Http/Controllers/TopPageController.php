<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

//追加
use Illuminate\Support\Facades\Auth;
use App\Models\UserName;
use App\Models\UserPhoto;

class TopPageController extends Controller
{
    public function index()
    {
        //Authはファサードなのでuseが必要
        $id = Auth::id();
        $contact = UserName::find($id);
        $name = $contact->user_name;

        $user_p = UserPhoto::find($id);
        $photo = $user_p->user_photo;
        


        return view('top.index',compact('id','name','photo'));
    }

}
