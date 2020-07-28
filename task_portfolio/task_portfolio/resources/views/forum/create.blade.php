@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">掲示板を作成</div>

                <div class="card-body">

                      <!--ヴァリデーションのエラーメッセージの表示。 -->
                      @if ($errors->any())
                        <div class="alert alert-danger">
                          <ul>
                            @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                            @endforeach
                          </ul>
                        </div>
                      @endif


                    <form method="POST" action="{{route('forum.store')}}">
                    <!-- ラベルでフォームを使うときは@csrfが必要 -->
                    @csrf
                    名前
                    <input type="text" name="poster_name">
                    <br>
                    タイトル
                    <input type="text" name="forum_title">
                    <br>
                    内容
                    <input type="text" name="forum_content">
                    <br>
                    <input class="btn btn-info" type="submit" value="登録する">
                    </form>

                  </div>
                </div>
            </div>
        </div>
    </div>
    @endsection
