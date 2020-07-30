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
        
        //webスクレイピング部分
        $URL = "https://www.data.jma.go.jp/obd/stats/data/mdrr/pre_rct/alltable/pre1h00_rct.csv"; //取得したいサイトのURL
        $html_source = file_get_contents($URL);
        $filename = './storage/mapdata/rainfall2.csv';
 
        // fopenでファイルを開く（'w'は上書きモードで開く）
        $fp = fopen($filename, 'w');
        
        //shift_jisからutf-8に変換する。
        $html_source=mb_convert_encoding($html_source,"utf-8","sjis");

        // fwriteで文字列を書き込む
        fwrite($fp, $html_source);
        
        // ファイルを閉じる
        fclose($fp);
        // ファイルを出力する
        // readfile($filename);
        //  dd ($html_source);

        return view('top.index',compact('id','name','photo'));
    }

}
