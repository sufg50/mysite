
<html>
    <head>
      <script src="{{ asset('js/app.js') }}"></script>
        @if (session('status'))
        <div class="alert alert-success" role="alert">
            {{ session('status') }}
        </div>
        @endif
      <title>ユーザー</title>

      {{-- bootstrapを含むcssファイルを読み込む --}}
      <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    </head>
    <style>
      .header {
        text-align: center;
        width: 100%;
        /* paddingは上、左右、下の順 */
        padding: 15px 0 10px;
        /* margin-top: 20px; */
        
        background: url(/storage/main_hedder/bg-header.gif)repeat-x;
        box-shadow: 0 0 10px 1px #e3e3e3;
        font-size: 20px;
}
table{
  margin-bottom: 500px;
  margin-top: 100px;
  margin-left: 130px;

  border: solid 1px;
}
    </style>
    <body>
      
      {{-- hedder --}}
      <div class="container-fluid">
        <div class="row">
          <div class="col-1"></div>
          <div class="col-9"> <header class="header"></header></div>
          <div class="col-2"></div>
        </div>
      </div>
        {{-- 中央部分 --}}
      <div class="container-fluid ">
        <div class="contens">
          {{-- <p>読み込みを完了しました。</p> 
         <button id="button" input="hidden">ok (音楽再生)</button>
         <button id="audio_stop">ストップ</button>
         <audio src="/storage/music/decision22.mp3"   id="audio"></audio> --}}
         <script>
           
          //  $("#button").on('click', function() {
          //       console.log("クリックされた！");
          //       var $audio = $("#audio").get(0);
          //       $audio.volume = 0.1;
          //       $audio.loop=false;//音楽の連続再生。間違ってるかも
          //       $audio.play();
          //       });
                
                // document.querySelector("#button").addEventListener('click', function() {
                //   console.log("クリックされた！");
                // var $audio = $("#audio").get(0);
                // $audio.volume = 0.1;
                // $audio.loop=false;//音楽の連続再生。間違ってるかも
                // $audio.play();
                // });
         </script>
        
      </div>
        {{-- margin-top:4em --}}
        <div class="row mt-4" >
          <div class="col-1">
          </div>
          <div class="col-6 ">
            {{-- ゲーム画面 --32pxだと縦１５チップ、横２０チップで構成されてる}}
            {{-- キャラを中央に表示させるならキャラ右に１０チップ左９チップみたい。--}}
            {{-- 基本的な画面比率は0.75見たい 48pxだと720(横15マス)×528(縦11マス)--}}
            <iframe src="{{ route('game.index') }}" width=" 720" height="528" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" style="border:none;"></iframe>
            {{--ifrmeの線消したいとき→ frameborder="0" style="border:none; --}}
          </div>
          <div class=col-1></div>
          <div class="col-2">
            {{-- サイドメニュー --}}
          <P>{{$name}}さんログイン中。ID:{{$id}}</p>
            <p><img src="/storage/profile_images/{{$photo}}" width="150px" height="150" ></p>
           <form method="GET" action="{{ route('user.profile') }}">
               @csrf
               <button type="submit" class="btn btn-primary">
               <p>Myページ<p>
               </button>
           </form>
           <form method="GET" action="{{ route('friend.index') }}">
           @csrf
           <button type="submit" class="btn btn-primary">
           <p>フレンド一覧<p>
           </button>
           </form>
       
           <form method="GET" action="{{ route('who_search.index') }}">
           @csrf
           <button type="submit" class="btn btn-primary">
           <p>誰かを検索する<p>
           </button>
           </form>
       
           <form method="GET" action="{{ route('forum.index') }}">
             @csrf
             <button type="submit" class="btn btn-primary">掲示板へ行く</button>
           </form>

          </div>

        </div>
      </div>

 {{-- <table>
   <tbody>
      <th> ■遊び方</td><td></td></th>
      <tr><td>Zキー / Enterキー </td><td>攻撃。項目の決定。その場で足踏み </td></tr>
      <tr><td>Xキー / Shiftキー </td><td> 	キャンセル。インベントリを開く</td></tr>
      <tr><td> Cキー / Spaceキー	</td><td> 振り向く。インベントリのソート</td></tr>
      <tr><td> Vキー</td><td> 高速移動。階段を下りる</td></tr>
   </tbody>
</table> --}}
  </body>
</html>

{{-- この構文でjavascriptのモジュールを読み込む --}}
{{-- 読み込む際はwebpack.mix.jsで読み込むjsファイルを書き込む。 --}}
{{-- <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    
    <script src="{{ asset('js/main.js') }}"></script>
    <title>Document</title>
</head>
<body>
    
</body>
</html> --}}

