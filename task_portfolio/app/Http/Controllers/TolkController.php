<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

//追加分
use App\Models\Tolk;
use App\Models\TolkContent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Session;

class TolkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        //２レコードを登録

        $my_id = $request->input('my_user_id');
        $friend_id=$request->input('to_user_id');

        $request->session()->put('friend_id', $friend_id);
        Session::save();

        //2つのカラムで一意とみなす。1,2がなければ2,1もないので、if文は１つでok。
        //同一レコードの2つのカラムでユニーク
        $unique_friend = DB::table('tolk_contents')
        ->where('user_id', $my_id)
        ->where('friend_id', $friend_id)->doesntExist();
        
        if($unique_friend ){//2カラムでユニークだったら
            //ログインしているユーザー
            $temporarily_friend=new TolkContent();
            $temporarily_friend->user_id=$my_id;
            $temporarily_friend->friend_id=$friend_id;
            $temporarily_friend->tolk_content="default";
            $temporarily_friend->save();

            //相手ユーザー
            $friend_id = $request->input('my_user_id');
            $my_id = $request->input('to_user_id');
            $temporarily_friend=new TolkContent();
            $temporarily_friend->user_id=$my_id;
            $temporarily_friend->friend_id=$friend_id;
            $temporarily_friend->tolk_content="default";
            $temporarily_friend->save();
        }
        //トーク内容を返す。  
            $contents = DB::table('tolk_contents')
            ->where('user_id','like',$my_id)
            ->where('friend_id','like',$friend_id)
            ->select('user_id','friend_id','tolk_content')->get();
        
        //vue.jsに渡す用の変数
        $my_id = $request->input('my_user_id');
        $friend_id=$request->input('to_user_id');
        
        dd($contents,$my_id,$friend_id);
         return view('tolk.index',compact("contents",'my_id','friend_id'));

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function get_Data()
    {

        

        // $comments = TolkContent::orderBy('created_at', 'desc')->get();

        $my_id = Auth::id();
        $friend_id = session('friend_id');
        Session::save();
        // トーク内容を返す。  ここで、検索かけたい。どう
         $comments = DB::table('tolk_contents')
         ->where('user_id','like',$my_id)
         ->where('friend_id','like',$friend_id)
         ->select('user_id','friend_id','tolk_content')->get();

        //$jsonという変数に連想配列で"comments"をkeyとして、tolkテーブルの全レコードをvalueとしてる。
        //この時点で配列
        $json = ["comments" => $comments];

        //jsonを返す
        return response()->json($json);

    }
     
    public function create(Request $request)
    {
        // dd($request);
         //ログインしているユーザー
         $my_id = $request->input('user_id');
         $friend_id=$request->input('friend_id');
         $tolk_content=$request->input('tolk_content');
         $temporarily_friend=new TolkContent();
         $temporarily_friend->user_id=$my_id;
         $temporarily_friend->friend_id=$friend_id;
         $temporarily_friend->tolk_content=$tolk_content;
         $temporarily_friend->save();

         //相手ユーザー
         $friend_id = $request->input('user_id');
         $my_id = $request->input('friend_id');
         $tolk_content=$request->input('tolk_content');
         $temporarily_friend=new TolkContent();
         $temporarily_friend->user_id=$my_id;
         $temporarily_friend->friend_id=$friend_id;
         $temporarily_friend->tolk_content=$tolk_content;
         $temporarily_friend->save();

         $contents = DB::table('tolk_contents')
         ->where('user_id','like',$my_id)
         ->where('friend_id','like',$friend_id)
         ->select('user_id','friend_id','tolk_content')->get();
       
         //redirectで戻れるのはweb.phpのルートがgetのところだけっぽい。
         //だから、getルートのstoreに一度迂回してから、tolk.indexへ行く。
         return  redirect('tolk/store');
        //  return redirect('forum/index');
    }
    public function add_data(Request $request){
        //２レコードを登録
        //ajax,axiosでは多分ファサードが上手く使えない。
        $my_id = $request->input('my_user_id');
        $friend_id=$request->input('to_user_id');
        $comment=$request->input('add_comment');


            //ログインしているユーザー
            $temporarily_friend=new TolkContent();
            $temporarily_friend->user_id=$my_id;
            $temporarily_friend->friend_id=$friend_id;
            $temporarily_friend->tolk_content=$comment;
            $temporarily_friend->save();

            //相手ユーザー
            $friend_id = $request->input('my_user_id');
            $my_id = $request->input('to_user_id');
            $temporarily_friend=new TolkContent();
            $temporarily_friend->user_id=$my_id;
            $temporarily_friend->friend_id=$friend_id;
            $temporarily_friend->tolk_content=$comment;
            $temporarily_friend->save();
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $my_id = Auth::id();
        $friend_id = session('friend_id');

        $contents = DB::table('tolk_contents')
            ->where('user_id','like',$my_id)
            ->where('friend_id','like',$friend_id)
            ->select('user_id','friend_id','tolk_content')->get();

        
        
         return view('tolk.index',compact("contents"));
        
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
