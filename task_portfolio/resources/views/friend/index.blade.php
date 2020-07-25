@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
    <!-- col-md-12の数字部分を変えてページの分割幅など？を決められる。 -->
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">フレンド一覧</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    
                    <table class="table">
                      <tbody>
                        <thead>
                            <tr>
                            <th scope="col">名前</th>
                            <th scope="col">画像</th>
                            <th scope="col">自己紹介文</th>
                            <th scope="col">あなたは友達？</th>
                            <th scope="col">  </th>

    
                            </tr>
                            
                                @foreach($contacts as $contact)
                                <tr>
                                <td>{{ $contact['name'] }}</td>
                                <td><img src="/storage/profile_images/{{$contact['photo']}}" width="100px" height="100px"></td>
                                <td>{{ $contact['my_self_introduction'] }}</td>
                                <td>{{ $contact['yes_or_no'] }}</td>
                                <td>フレid:{{$contact['user_id']}}</td>
                                {{-- <td><a href="{{ route('tolk.index',['id'=>$contact['user_id']]) }}">トークする</a></td> --}}
                                <td>
                                <form method="POST" action="{{ route('tolk.index') }}">
                                    @csrf
                                    <input type="hidden" name="my_user_id" value="{{ $my_user_id }}" />
                                    <input type="hidden" name="to_user_id" value="{{ $contact['user_id'] }}" />
                                    <button type="submit" class="btn btn-primary">
                                    <p>トークする<p>
                                    </button>
                                </form>
                                 </td>
                                {{-- <td><a href="{{ route('who_search.apply',['id'=> $contact['user_id']]) }}">トークする。ID:{{ $contact['user_id'] }}</a></td> --}}

                            </tr>
                                @endforeach
                           
                        </thead>
                      </tbody>
                    </table>
                    
                    <!-- ページネーション -->
                    {{-- {{$contacts->links()}} --}}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
