module.exports = class Group{
    constructor () {
        this.toUser;
        this.froUser;
    }
    
    enter(MongoClient,url,names,socket_id,io,roomUsers,roomName,rooms,socket){
                let roommei=roomName;
                let msg="";
                roomUsers.forEach(roomUser => {
                    console.log("ルームメンバ"+roomUser);
                });

            // データベースへ登録する
            MongoClient.connect(url,(error,client)=>{
                var db = client.db("heroku_v52vjggz");
                db.collection("group_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                    collection.find({groupName: { $eq: String(roommei)} }).toArray((error,docs)=>{
                        if(docs.length<=0){//グループルームが作られていなければ。
                            roomUsers.forEach(roomUser => {
                                collection.insertOne(
                                    {roomName: roommei, user: roomUser,contents: msg},
                                    ),(error,result)=>{
                                        client.close();
                                };    
                            });                                
                        }
                    });
                });
            });

            let contents_row=[];

            function getContents_group(){
                return new Promise((resolve, reject)=>{
                
                    let i3;

                    
                    // DBから過去のトーク内容をすべてfindで検索して取ってくる。
                    MongoClient.connect(url,(error,client)=>{
                        var db = client.db("heroku_v52vjggz");
                        db.collection("group_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                            console.log(roommei);
                            collection.find({roomName: { $eq: roommei} }).toArray((error,docs)=>{
                                console.log(docs.length);
                                contents_row=docs;
                                for(let doc of contents_row){
                                    console.log("DB検索一致:"+doc.groupName);
                                }

                                if(docs.length>=0){// 本来この引数はＤＢへの登録が終わったらtrueになる。new promise以降が同期処理のようになってる。
                                    i3=true;
                                    resolve(i3);
                                }else{
                                    i3=false;
                                    reject(i3);
                                }  
                                client.close();
                            });
                        });
        
                    });// DB接続終わり
                });  // return promise終わり
            }// getContents_1on1()　終わり

            var promise3=[];
            promise3 = getContents_group();

            promise3.then((value) => {
                
                let to=true;
                let from=true;
                //ログイン中のユーザにはemitする必要がある。特定ユーザーのみに送る。
                for (let key2 in contents_row) {
                    for (let key in names) {
                        if(String(names[key])==String(contents_row[key2].user)){
                            // 自分自身へ送信。
                            io.to(socket_id).emit('group_tolkContents',contents_row);
                        }
                    }    
                }
            },(error) => {
                console.error("error!!:"+error);
            });
     }//enter終わり

     //グループチャットのとき
     message=(MongoClient,url,names,socket_id,io,roomName,msg,rooms,socket)  => {
            // データベースへ登録する
            function touroku(){
                let tourokuok;
                return new Promise((resolve, reject)=>{
                    MongoClient.connect(url,(error,client)=>{
                        var db = client.db("heroku_v52vjggz");
                        db.collection("group_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                            tourokuok=collection.insertOne(
                                    {roomName: roomName, user: names[socket_id],contents: msg}
                            ),(error,result)=>{
                                    client.close();
                            };                    
                        });
                        if(Boolean(tourokuok)){// 本来この引数はＤＢへの登録が終わったらtrueになる。new promise以降が同期処理のようになってる。
                            resolve(tourokuok);
                        }else{
                            reject(tourokuok);
                        }  

                    });//DB接続終わり

            }); //promise return終わり

            }// touroku終わり



            let contents_row=[];

            function getContents_group(){
                return new Promise((resolve, reject)=>{
                
                    let i3;

                    
                    // DBから過去のトーク内容をすべてfindで検索して取ってくる。
                    MongoClient.connect(url,(error,client)=>{
                        var db = client.db("heroku_v52vjggz");
                        db.collection("group_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                            collection.find({roomName: { $eq: roomName} }).toArray((error,docs)=>{
                                contents_row=docs;
                                for(let doc of contents_row){
                                    console.log("DB検索一致:"+doc.roomName+"。"+doc.user+"。"+doc.contents);
                                }

                                if(docs.length>=0){// 本来この引数はＤＢへの登録が終わったらtrueになる。new promise以降が同期処理のようになってる。
                                    i3=true;
                                    resolve(i3);
                                }else{
                                    i3=false;
                                    reject(i3);
                                }  
                                client.close();
                            });
                        });

                        // setTimeout(() => {
                        //     console.log(Boolean(i3));
                        // }, 3000);

                        // console.log("getCont"+Boolean(i3));// true　
        
                    });// DB接続終わり
                });  // return promise終わり
            }

        var promise=[];
        var promise3=[];
        promise=touroku();

        promise.then((value)=>{   
            promise3 = getContents_group();
            promise3.then((value) => {
                
                //ログイン中のユーザにはemitする必要がある。特定ユーザーのみに送る。
                for (let key2 in contents_row) {
                    for (let key in names) {
                        if(String(names[key])==String(contents_row[key2].user)){
                            //　同じ部屋の自分以外へ送信。
                            socket.broadcast.to(rooms[key]).emit('group_tolkContents',contents_row);
                            // 自分自身へ送信。
                            io.to(socket_id).emit('group_tolkContents',contents_row);
                            // io.to(key).emit('group_tolkContents', contents_row)
                            console.log("送り主を見つけた[socketid]"+key);
                        }

                    }
                    
                }
            },(error) => {
                console.error("error!登録前にfindしてしまいました。:"+error);
            });

        },(error) => {
            console.error("error!DBに登録できませんでした。:"+error);
        });


    }
    
    
}