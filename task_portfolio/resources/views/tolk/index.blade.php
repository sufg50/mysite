<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    hello
</body>
</html>
{{-- 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {{-- app.jaの中にあるjqueryとvue.jsを読み込み --}}
{{--
    <script src="{{ asset('js/app.js') }}"></script>
    <title>トークルーム</title>
</head>
<body>
    ガガガ、工事中
    @foreach($contents as $index => $content)
        @if ($index != 0)
            @continue
        @endif
    <dt>自分のid:{{ $content->user_id }}</dt>
    <dt>相手id:{{ $content->friend_id }}</dt>
    
    
@endforeach

<h2>--リアルタイムチャット--</h2>

<div id="app" class="container">
    <h1>My Todo Lists</h1>
    <ul>
      <li v-for="(todo,index) in todos" >@{{ todo }}
        <span class="pull-right">
            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
        </span>
      </li>
    </ul>
  <form @submit.prevent="addItem({{ $my_id }},{{$friend_id}})">
    <input type="text" v-model="newItem">

  

    <input type="submit" value="add">
  </form>

</div>

<script>
    var vm=new Vue({
       el: '#app',
       data: {
           newItem: '',
           todos: [],
           add_comment: '',
           my_id: '5',
           to_user_id: '5',

       },
       methods: {
       addItem: function(my_id,friend_id){
           this.todos.push(this.newItem);
           //this.newItem='';
           vm.my_id = my_id;
           vm.to_user_id = friend_id;
           console.log("my_id:"+vm.my_id+"to_user_id"+vm.to_user_id);
           
           //web.phpのルートへ飛ばす
            axios.post('add_data',{
                my_user_id: my_id,
                to_user_id: friend_id,
                add_comment: this.newItem
            })
            .then(function (response) {//通信成功
                
                console.log("成功");
                //ここでthis.newItem=''にすると初期化できていない
                vm.newItem='';

            })
            .catch(function (error) {
                console.log("エラー");
           
            })
            console.log("sendCommentメソッド");
        },
       
   }//method終わり
});//vue.js終わり
        
    

    //読み込み時にget_data()が実行される.
    $(function(){
        get_data();
    });

    var count=0;
    function get_data(){
         $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },//Headersを書き忘れるとエラーになるかも
            url: "get_data", dataType: 'json'})
        //読み込み完了の時
        .done(function(data){
            $("#comment-data").empty()
            console.log(data);
            //配列を初期化して追加登録されないようにする。
            vm.todos=[];
            vm.newItem='';
            for (var i = 0; i < data.comments.length; i++) {
                console.log(data.comments[i].user_id);
                console.log(data.comments[i].friend_id);
                console.log(data.comments[i].tolk_content);
                // $("#comment-data").append("<p>  --------------------</p>");
                // $("#comment-data").append("<p>"+data.comments[i].tolk_content+"</p>");
                //vmでvue.jsのインスタンスを指定出来るみたい
                vm.todos.push(data.comments[i].tolk_content);
            }
        })
        //読み込み失敗のとき
        .fail(function(){
            //window.alert('読み込みエラー');
         });
        console.log("回数"+count++);
        //setTimeoutには関数オブジェクトを渡さないと無限ループエラー
        setTimeout("get_data()", 5000);
    };
        
</script>

</body>
</html>
 --}}
