<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Forum;
use App\Models\ForumContent;
use App\Http\Requests\ForumCreateForm;
use App\Http\Requests\ForumCommentForm;
use Illuminate\Support\Facades\DB;

class ForumController extends Controller
{

    public function index(Request $request){

        //クエリビルダ。単純にデータを取得する場合。
        // $contacts = DB::table('contact_forms')
        // ->select('id', 'your_name', 'title', 'created_at')
        // ->orderBy('created_at', 'asc')
        // ->paginate(20);  

        //検索フォーム、ページネイトを使う場合。
         $search = $request->input('search');
         // 検索フォーム
         $query = DB::table('forums');

         //もしキーワードがあったら
         if($search !== null){
             //全角スペースを半角に
             $search_split = mb_convert_kana($search,'s');
 
             //空白で区切る
             $search_split2 = preg_split('/[\s]+/', $search_split,-1,PREG_SPLIT_NO_EMPTY);
 
             //単語をループで回す
             foreach($search_split2 as $value)
             {
             $query->where('forum_title','like','%'.$value.'%');
             }
         };
         
         //検索フォーム、ページネーション用、単純にこれでＤＢからの情報を取得できない。
         $query->select('id','forum_title', 'created_at');
         $query->orderBy('created_at', 'desc');
         $contacts = $query->paginate(20);

         
        return view('forum.index',compact('contacts'));
    }


    public function create(){

        return view('forum.create');
    
    }


    public function store(ForumCreateForm $request){

        ///引数の説明:バリデーションを作ってそのクラスのオブジェクトを受け取る。

        //使うモデルを指定、まず掲示板一覧に登録
        $contact = new Forum;
        $contact->poster_name = $request->input('poster_name');
        $contact->forum_title = $request->input('forum_title');
        $contact->save();

        //次に個別のスレッドとして登録
        $forum = new ForumContent;
        $forum->forum_title = $request->input('forum_title');
        $forum->forum_content = $request->input('forum_content');
        $forum->poster_name = $request->input('poster_name');
        $forum->save();

        //ルートに戻ってから、viewを表示させたいときはredirect
        return redirect('forum/index');
    }
    public function show_store(ForumCommentForm $request){

        //個別の掲示板からの投稿を登録する。
        //バリデーションチェックして禁止ワードとかもうけたほうがいいかも。

        $forum = new ForumContent;
        $forum->forum_title = $request->input('forum_title');
        $forum->forum_content = $request->input('forum_content');
        $forum->poster_name = $request->input('poster_name');
        $forum->save();
        $id=($request->forum_id);
        //直前のページ、パラメータ付きのshowに戻る。
        return back();
    }

    public function show($id)
    {
        //掲示板一覧から主キーで、どの掲示板か検索
        $forum = Forum::find($id);
        $title = $forum->forum_title;
        //先にwhereで後でselect使う。掲示板whereで、
        //whereでタイトル名と一致する行を取得し、selectでそのうちの列を指定する。
        $contents = DB::table('forum_contents')->where('forum_title','like',$title)
        ->select('forum_title','forum_content','poster_name','created_at')->get();
        // dd($contents);
        return view('forum.show', compact('contents','title'));
    }
}
