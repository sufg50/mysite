@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Dashboard</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                    @endif
                    
                    editです
                    <form method="POST" action="{{ route('user.update',['id'=>$id]) }}" enctype="multipart/form-data" >
                        @csrf

                        名前
                        <input type="text" name="name" value="{{ $name }}">
                        <br>
                        画像
                        <input type="file" name="photo" enctype="multipart/form-data">
                        <br>
                        自己紹介文
                        <input type="text" name="self_introduction" value="{{ $self_introduction }}">
                        <br>
                        
                        <input class="btn btn-info" type="submit" value="更新する">
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
