console.log('socket test');

//これはサーバー側へconnectedする。
//違うファイルに同じこと書くとエラーの原因になった
var socket = io();


function send(message){
    console.log(message);

    //サーバーへメッセージを送る
    socket.emit('message',message);

}

function sendEnterRoom(message){
    socket.emit('join room',message);
}

//サーバーからの通信を受け取る
socket.on('message',(msg)=>{
    var dom = $('<li>'+msg+'</li>');
    $("#commentArea").append(dom);
});

socket.on('getUser',(users)=>{
    $("#user_list").empty();

    users.forEach(user => {
        var dom = $('<li>☆'+user+'</li>');
        $("#user_list").append(dom);
    });

});

socket.on('insertUser',(users)=>{
    $("#login_user").empty();

    users.forEach(user => {
        console.log(user);
        var dom = $('<li>★login>>'+user+'</li>');
        $("#login_user").append(dom);
    });

});
//誰が入力中？
socket.on('message 2',(msg)=>{
    // $("#whoTyping").remove();
    var elem = document.getElementById("whoTyping");
    elem.innerHTML = msg;

    setTimeout(() => {
        elem.innerHTML = "";
    }, 3000);
});

//サーバーからの通信を受け取る
socket.on('disconnect',(msg)=>{
  
    
});
