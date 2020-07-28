<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

//追加分
use App\Models\UserName;
use App\Models\MySelfIntroduction;
use App\Models\UserPhoto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\MyFriendUserId;
use App\Http\Requests\FriendRequest;
use Illuminate\Pagination\LengthAwarePaginator;

class WhoSearch extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     //Requestと付けるのはサーチボックスからのリクエスト
    public function index(Request $request)
    {
        //フレンドへ追加のボタンが押された後のバリデーションチェックのため、ユーザーidを送る。
        $my_user_id = Auth::id();

        //ユーザーデータ一覧をモデルが取得
        $users = UserName::all();
        $contacts = [];
        foreach ($users as $user) {
            $contacts[] = [
                'name'  => $user->user_name,
                // user_photosテーブル - user_photoカラム。
                //モデルに書いたリレーショナル関係はあくまで、テーブルの指定だけなので、
                //カラム名を最後につける。
                'photo' => $user->photos->user_photo,
                'my_self_introduction'=>$user->my_self_introductions->my_self_introduction,
                'user_id'=>$user->id
            ];
        }


        //検索フォーム関連
        $search = $request->input('search');
        $query = DB::table('user_names');
        //もしキーワードがあったら
        if($search !== null){
           //全角スペースを半角に。DBへのアクセスは半角にしないとだめ。
           $search_split = mb_convert_kana($search,'s');

           //空白で区切る
           $search_split2 = preg_split('/[\s]+/', $search_split,-1,PREG_SPLIT_NO_EMPTY);

           //単語をループで回す
           foreach($search_split2 as $value)
           {
           // whereの第一引数はカラム名
           $query->where('user_name','like','%'.$value.'%');
           }
           //元あるユーザ一覧配列contactsに追加されないように配列をリセットする。
           $contacts=[];

           $query->select('id');
           $query->orderBy('created_at', 'asc');
           $query = $query->get();


           //空の配列の要素を取得するエラーを防がないとだめ。
            $array = $query->toArray();
            if(isset($array[0])){//配列の０番目の要素が存在するかどうか
                for($i=0;$i<count($array);$i++)
                    {
                        $user = UserName::find($array[$i]->id);
                        $contacts[] = [
                             'name'  => $user->user_name,
                             'photo' => $user->photos->user_photo,
                             'my_self_introduction'=>$user->my_self_introductions->my_self_introduction,
                             'user_id'=>$user->id
                         ];
                    }
            }
        
   
        };//検索処理終わり


        //引数説明(自前の配列,自前配列数(総数),1ページに表示する数,現在のページ番号,オプションをarrayで指定)
        //配列のページネーション参考url  https://qiita.com/wallkickers/items/35d13a62e0d53ce05732
        $contacts = new LengthAwarePaginator(
            //array_sliceは第二引数番目の要素から第三引数の数だけ切り取る
                array_slice( $contacts, $request->page, 2 ), 
                 count($contacts),
                 2, 
                 $request->page,
                 array('path'=>$request->url())
                );
        // dd($contacts);
        
        return view('who_search.index',compact('contacts','my_user_id'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function apply(Request $request)//引数$idは申請された側
    {
        //申請された側と申請した側の２つのフレンドテーブルを更新
        //申請した側。
        $my_id = $request->input('my_user_id');
        $friend_id=$request->input('to_user_id');

        //2つのカラムで一意とみなす。1,2がなければ2,1もないので、if文は１つでokかも。
        //あと自分がをフレンド追加した場合はなんとなく、自分もフレンドに追加できるようにしておく。
        $unique_friend = DB::table('my_friend_user_ids')
        ->where('id', $my_id)
        ->where('my_friend_user_id', $friend_id)->doesntExist();
        if($unique_friend ){
            //申請するほう。
            $temporarily_friend=new MyFriendUserId();
            $temporarily_friend->id=$my_id;
            $temporarily_friend->my_friend_user_id=$friend_id;
            $temporarily_friend->yes_or_no="yes";
            $temporarily_friend->save();

            //申請された側。
            if($my_id != $friend_id ){// 自分をフレンド追加しようとしているときは、実行されない
                $friend_id = $request->input('my_user_id');
                $my_id = $request->input('to_user_id');
                $temporarily_friend=new MyFriendUserId();
                $temporarily_friend->id=$my_id;
                $temporarily_friend->my_friend_user_id=$friend_id;
                $temporarily_friend->yes_or_no="yes";
                $temporarily_friend->save();
            }
            
        }
        

        return back();


    }

}
