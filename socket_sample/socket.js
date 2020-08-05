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

function send_1on1(ToName,message){
    socket.emit('1on1_tolkContents',ToName,message);//「トークする」がクリックされたとき
}
function send_1on1_message(toUser,message){
    socket.emit("1on1_message",toUser,message);

}
function setdCreateRoom(roomUsers,roomName){
    socket.emit("createRoom",roomUsers,roomName)

}
function send_group_message(roomName,msg){
    socket.emit("group_message",roomName,msg);
}

socket.on("send_group_message",(msg)=>{
    $("#commentArea").empty();
    let url_name=location.href ;
    url_name=url_name.split("html");
    for (let key in msg) {
        console.log("内容："+msg[key].contents+"。"+msg[key].toUser+"へ。"+msg[key].fromUser+"から。");
        console.log(url_name[1]);
        if(msg[key].fromUser==url_name[1]){
            var dom = $('<li style="text-align:right">'+msg[key].contents+'</li>');
            $("#commentArea").append(dom);
        }else{
            var dom = $('<li>'+msg[key].contents+'</li>');
            $("#commentArea").append(dom);
        }

    }
});

socket.on('1on1_tolkContents',(msg)=>{
    $("#commentArea").empty();
    let url_name=location.href ;
    url_name=url_name.split("html");
    for (let key in msg) {
        console.log("内容："+msg[key].contents+"。"+msg[key].toUser+"へ。"+msg[key].fromUser+"から。");
        console.log(url_name[1]);
        if(msg[key].fromUser==url_name[1]){
            var dom = $('<li style="text-align:right">'+msg[key].contents+'</li>');
            $("#commentArea").append(dom);
        }else{
            var dom = $('<li>'+msg[key].contents+'</li>');
            $("#commentArea").append(dom);
        }

    }

});
socket.on('group_tolkContents',(msg)=>{
    $("#commentArea").empty();
    let url_name=location.href ;
    url_name=url_name.split("html");
    for (let key in msg) {
        console.log("内容："+msg[key].user+"。"+msg[key].contents);
        if(msg[key].fromUser==url_name[1]){
            var dom = $('<li style="text-align:right">'+msg[key].contents+'</li>');
            $("#commentArea").append(dom);
        }else{
            var dom = $('<li>'+msg[key].contents+'</li>');
            $("#commentArea").append(dom);
        }

    }
    socket.emit("getRooms");

});
socket.on("getRooms",(rooms)=>{
    $("#room_list").empty();
    rooms.forEach(room => {
        var dom = $('<li>'+room+'</li>');
        $("#room_list").append(dom);
    });
});

//サーバーからの通信を受け取る
socket.on('message',(msg)=>{
    var dom = $('<li>'+msg+'</li>');
    $("#commentArea").append(dom);
});

socket.on('getUser',(users)=>{
    $("#user_list").empty();
    $("#RoomCreate_userList").empty();


    users.forEach(user => {
        var dom = $('<li>☆'+user+'</li>');
        $("#user_list").append(dom);
    });
    users.forEach(user => {
        var dom = $('<li><input type="checkbox"/ name="hoge" value='+user+">"+user+'</li>');
        $("#RoomCreate_userList").append(dom);
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
