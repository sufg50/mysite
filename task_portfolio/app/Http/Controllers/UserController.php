<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\UserName;
use App\Models\MySelfIntroduction;
use App\Models\UserPhoto;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function profile()
    {
        //Authはファサードなのでuseが必要
        $id = Auth::id();

        $contact = UserName::find($id);
        $name = $contact->user_name;

        $contact = UserPhoto::find($id);
        $photo = $contact->user_photo;

        
        $contact = MySelfIntroduction::find($id);
        $self_introduction = $contact->my_self_introduction;

        return view('user.profile',compact('id','name','photo','self_introduction'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //編集画面へ飛ばす。
        $contact = UserName::find($id);
        $name = $contact->user_name;
        

        $contact = UserPhoto::find($id);
        $photo = $contact->user_photo;
        
        $contact = MySelfIntroduction::find($id);
        $self_introduction = $contact->my_self_introduction;
        return view('user.edit',compact('id','name','photo','self_introduction'));
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
        $request->validate([
            'name'=>['required','string','max:50'],
            'photo'=>['file','mimes:jpeg,png,jpg,bmb','max:2048'],
        ]);
        
        $name =  $request->input('name');
        $self_introduction = $request->input('self_introduction');

        //画像処理関連
        //アップロードされたファイルの拡張子を取得
        //formからの値を取得するとき画像はinputを使わないことに注意。
        //拡張子を取得する

        //if文の中で変数作るとエラーになるので、初期宣言
        $photo = $request->photo;
        $type_content = '';

        //画像を選択されずに更新されたときのため
        $contact = UserPhoto::find($id);
        $photo_name = $contact->user_photo;

        if($photo){//ファイルが指定されてnullじゃないとき
            $type_content=$photo->getClientOriginalExtension();

            //アップロードされたファイルをディレクトリに保存する。
            //保存場所は\task_portfolio\storage\app\public\profile_images\ここ
            //保存されたファイル名とDBに登録されたuser_photoを同名にしておく。
            $photo_name=Auth::id() .'.'. $type_content;
            $request->photo->storeAs('public/profile_images', $photo_name);
        }
        
       
       

        DB::table('user_names')
              ->where('id', $id)
              ->update(['user_name' => $name]
            );

        DB::table('user_photos')
              ->where('id', $id)
              ->update(['user_photo' => $photo_name]
            );
        

        DB::table('my_self_introductions')
        ->where('id', $id)
        ->update(['my_self_introduction' => $self_introduction]
      );


        // $contact->save();
        //  dd($id,$name,$photo,$self_introduction);
        return redirect('user/profile');
        
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
