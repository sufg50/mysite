@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
    <!-- col-md-12の数字部分を変えてページの分割幅など？を決められる。 -->
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">ユーザ一覧</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

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

                    <!-- サーチボックスの埋め込み -->                    
                    <form method="GET" action="{{ route('who_search.index') }}" class="form-inline my-2 my-lg-0">
                    @csrf
                    <input class="form-control mr-sm-2" name="search" type="search" placeholder="検索" aria-label="Search">
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">検索する</button>
                    </form>



                    <table class="table">
                      <tbody>
                        <thead>
                            <tr>
                            <th scope="col">名前</th>
                            <th scope="col">画像</th>
                            <th scope="col">自己紹介文</th>
                            <th scope="col"></th>
    
                            </tr>
                            
                                @foreach($contacts as $contact)
                                <tr>
                                <td>{{ $contact['name'] }}</td>
                                <td><img src="/storage/profile_images/{{$contact['photo']}}" width="100px" height="100px"></td>
                                <td>{{ $contact['my_self_introduction'] }}</td>
                                {{-- ここボタンにする。バリデーションチェックで二重登録にならないように --}}
                                {{-- <td><a href="{{ route('who_search.apply',['id'=> $contact['user_id']]) }}">フレンドに追加。ID:{{ $contact['user_id'] }}</a></td> --}}
                                <td>
                                <form method="POST" action="{{ route('who_search.apply') }}">
                                    @csrf
                                    <input type="hidden" name="my_user_id" value="{{ $my_user_id }}" />
                                    <input type="hidden" name="to_user_id" value="{{ $contact['user_id'] }}" />
                                    <button type="submit" class="btn btn-primary">
                                    <p>フレンドに追加する<p>
                                    </button>
                                </form>
                                </td>
                            </tr>
                                @endforeach
                           
                        </thead>
                      </tbody>
                    </table>
                    
                    <!-- ページネーション -->
                    {{$contacts->links()}}

                    {{-- ページネーションのカスタマイズはブラウザの検証みるとできるかも下、例 --}}
                    {{-- <button>
                    <a href="http://127.0.0.1:8000/who_search/index?page=2" class="page-link">次へ行く</a>
                    </button> --}}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
