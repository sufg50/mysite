
 $(function () {

    //レフトメニューからのシーン遷移
    $(document).on("click", "#leftTop", function(){
        $("*").removeClass("co-1on1");//index.htmlのmessageの分岐フラグ
        $("#commentArea").empty();
        $("#room").css("display", "block");
        $("#nic").css("display", "block");
        $(".main_top").css("display" , "inline-block");
        $(".main_1on1").css("display" , "none");
        $(".middle_top h4").css("display", "block");
        $("#user_list").css("display", "block");
        $("#login_user").css("display", "block");
        $(".middle_top p").css("display", "none");
        $("#RoomCreate_userList").css("display" , "none");
        $("#co").removeClass("co-group");
        $("#room_list").css("display" , "none");




        $("#roomTitle").text("トップページ");
    });
    $(document).on("click", "#leftRoom", function(){
        $(".middle_top h4").css("display", "none");
        $("#user_list").css("display", "none");
        $("#login_user").css("display", "none");
        $(".middle_top p").css("display", "block");
        $("#RoomCreate_userList").css("display" , "block");
        $("#room_list").css("display" , "block");

        socket.emit("getRooms");

    });

    //ミドルメニューからのシーン遷移
    $(document).on("click", "#user_list li", function(){
        let str=$(this).text().split("☆")[1];
        $(".main_top").css("display" , "none");
        $(".main_1on1").css("display" , "inline-block");
        $(".main_1on1").html("<div id='1on1_tolk_to_name' style='margin:auto; margin-top: 280px; margin-bottom: 5px;'>"+str+"</div><p id='1on1_Enter'>トーク</p>");
    
    });
    $(document).on("click", "#createRoom", function(){
        let str=$(this).text().split("☆")[1];
        $(".main_top").css("display" , "none");
        $(".main_top").css("display" , "inline-block");
        $("#nic").css("display", "none");
        $("#room").css("display", "none");
        $("*").removeClass("co-1on1");
        $("#co").addClass("co-group");
        
        // 登録例)
        // グループ名, ユーザー1, 内容
        // グループ名, ユーザー2, 内容
        // 手順)ユーザー名に自分の名前があったならば、そのグループ名の内容をすべて取得する。
        let roomName=$("#commitGroupName").val();
        if(roomName.length==0){
            alert("グループ名を入力してください。");
        }else{
            let roomUsers=[];
            let url_name=location.href ;
            url_name=url_name.split("html");
            roomUsers.push(url_name[1]);
            var elements = document.getElementsByName("hoge");
            let roommei="";
            roommei+=url_name[1];
            for ( var a="", i=elements.length; i--; ) {
                if ( elements[i].checked ) {
                    roomUsers.push(elements[i].value);
                    roommei += (elements[i].value);
                }
            }
            

            $("#roomTitle").text(roomName);
            setdCreateRoom(roomUsers,roomName);            
        }

        


    
    });
    // ルーム名がクリックされたとき
    $(document).on("click","#room_list li",function(){
        let str=$(this).text().split("☆")[1];
        $(".main_top").css("display" , "none");
        $(".main_top").css("display" , "inline-block");
        $("#nic").css("display", "none");
        $("#room").css("display", "none");
        $("*").removeClass("co-1on1");
        $("#co").addClass("co-group");
        let roomName=$(this).text();
        $("#roomTitle").text(roomName);
        let roomUsers=[];
        //ルームへenterしてコンテンツを取得する.
        setdCreateRoom(roomUsers,roomName);
        // ルームへ参加。
        sendEnterRoom(roomName);
        

    })


    //メインメニューからのシーン遷移
    //トークするがクリックされたとき
    $(document).on("click", "#1on1_Enter", function(){
        // 相手とのトークルームがなければ作る。
        let toName=$("#1on1_tolk_to_name").text();
        let message="";
        send_1on1(String(toName),message);
        // メインメニュー内でシーン遷移する。
        $(".main_1on1").css("display" , "none");
        $(".main_top").css("display" , "inline-block");
        $("#nic").css("display", "none");
        $("#room").css("display", "none");
        $("*").removeClass("co-1on1");
        $("#co").addClass("co-1on1");
        //　送り主を表示しておく。
        $("#roomTitle").text(toName);

        
   



    });


});