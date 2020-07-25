@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
    <!-- col-md-12の数字部分を変えてページの分割幅など？を決められる。 -->
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Myページ</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif


                    <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">名前</th>
                        <th scope="col">画像</th>
                        <th scope="col">自己紹介文</th>

                        </tr>
                        <tr>
                            <td>{{ $name }}</td>
                            <td><img src="/storage/profile_images/{{$photo}}" width="100px" height="100px"></td>
                            <td>{{ $self_introduction }}</td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    </table>
                    <a href="{{ route('user.edit', ['id' => $id ]) }}">変更する</a>

                    
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
