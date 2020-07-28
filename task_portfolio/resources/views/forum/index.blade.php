


<html>
  <head>
    <title>掲示板一覧</title>
  </head>
  <body style=font-size:18px; bgcolor="#EFEFEF">
  <a href="{{ route('top.index') }}">■メインページへ戻る■</a>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12">
    <p>新着</p>
    <table>
      
          <tr>
          <th scope="col">タイトル</th>
          <th scope="col">日時</th>
          </tr>

      <!-- コントローラがモデルを使って取得したデータを受け取り、表示する。 -->
      @foreach($contacts as $contact)
      <tr>
        <th><a href="{{ route('forum.show',['id'=>$contact->id]) }}">{{ $contact->forum_title}}</a></th>
        <th>{{ $contact->created_at}}</th>
      </tr>
      @endforeach

    </table>

    
     <!-- サーチボックスの埋め込み -->               
    <form method="GET" action="{{ route('forum.index') }}" class="form-inline my-2 my-lg-0">
      @csrf
      <input class="form-control mr-sm-2" name="search" type="search" placeholder="検索" aria-label="Search">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">検索する</button>
    </form>


    <form method="GET" action="{{ route('forum.create') }}">
        @csrf
        <button type="submit" class="btn btn-primary">
        <p>新規のスレッドを作成<p>
        </button>
    </form>

  </div>
</div>
</div>
  </body>
  </html>
