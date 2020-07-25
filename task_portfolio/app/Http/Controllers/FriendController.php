<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//追加分
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\MyFriendUserId;
use App\Models\UserName;
use App\Models\MySelfIntroduction;
use App\Models\UserPhoto;

class FriendController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        $my_user_id = Auth::id();

        //自分のidで検索
        $id = Auth::id();
        //whereの第一引数で列名、それ以降で一致する行を取得し、selectでそのうちの列を指定する。
        $friends = DB::table('my_friend_user_ids')->where('id','like',$id)
        ->select('my_friend_user_id','yes_or_no')->get();

        //クエリビルダは配列としてアクセルもできそう
        //$test =$friends[0]->my_friend_user_id;

        $contacts = [];

        //空の配列の要素を取得するエラーを防がないとだめ。
        $array = $friends->toArray();
        if(isset($array[0])){//配列の０番目の要素が存在するかどうか
            for($i=0;$i<count($array);$i++)
                {
                    $user = UserName::find($array[$i]->my_friend_user_id);
                    //仮フレンドっていう概念がない。
                    //デフォルトでyesだから、noだったらブロックしているとする。
                    $contacts[] = [
                        'name'  => $user->user_name,
                        'photo' => $user->photos->user_photo,
                        'my_self_introduction'=>$user->my_self_introductions->my_self_introduction,
                        'user_id'=>$user->id,
                        'yes_or_no'=>$array[$i]->yes_or_no
                     ];
                }
        }

        // dd($contacts);
        return view('friend.index',compact('contacts','my_user_id'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    
}
