
<html>
    <head>
      
    </head>
    <style>
      b{
        color:mediumblue;
        color: -webkit-link;
      }
      dd {
      display: block;
      margin-inline-start: 40px;
      }
      </style>
    <body bgcolor="#EFEFEF">
        <a href="{{ route('forum.index') }}">■掲示板に戻る■</a>
        {{-- コレクション型の変数は{{}}@foreachなどで囲まないと使えない。 --}}
        {{-- １つのデータだけの普通の変数は下の通りで大丈夫 --}}
        <h4>{{ $title }}</h4>


        <!-- コントローラがモデルを使って取得したデータを受け取り、表示する。 -->
        {{-- $index =>でループ回数を取得、配列の要素になってるので、最初は０ --}}
        @foreach($contents as $index => $content)

        <dt color="blue">{{ $index+1 }} :<b><u>{{ $content->poster_name }}</u></b>
         ；{{$content->created_at}}</dt>
        <dd>{{ $content->forum_content }}<p></p></dd>
        @endforeach
  

      <!--バリデーションチェック、エラーが起きた時  -->
      @if ($errors->any())
      <div class="alert alert-danger">
          <ul>
              @foreach ($errors->all() as $error)
                  <li>{{ $error }}</li>
              @endforeach
          </ul>
      </div>
      @endif
  {{-- ここからコメント入力エリア --}}
      <form method="POST" action="{{route('forum.show_store')}}">
        <!-- ラベルでフォームを使うときは@csrfが必要 -->
        @csrf
        名前
        <input type="text" name="poster_name" value="名無しの匿名さん">
        <br>
        内容
        <input type="textarea" name="forum_content" style="height:100px;" >
        <br>
        <input type="hidden" name="forum_title" value={{ $content->forum_title }}>
        
        <input class="btn btn-info" type="submit" style="margin-left:70px; margin-top:30px" value="コメントする">
      </form>
      


    </body>
  </html>