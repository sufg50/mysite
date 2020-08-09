var app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');
const { equal, rejects } = require('assert');
const { resolve } = require('path');
var http = require('http').createServer(app);
var port = process.env.PORT || 5000;
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://heroku_v52vjggz:gjdrohmubrprcpjm81svdl2aq9@ds131432.mlab.com:31432/heroku_v52vjggz";
app.use(bodyParser.urlencoded({
    extended: true
}));
// mongodb://localhost:27017/
// mongodb://heroku_v52vjggz:gjdrohmubrprcpjm81svdl2aq9@ds131432.mlab.com:31432/heroku_v52vjggz
app.use(bodyParser.json());
var Person = require('./index_1on1');
var Group = require('./index_group');


var io =require('socket.io')(http);//トップレベルドメイン。サーバーの中でsocket.ioを動かすイメージ

app.get('/register',(req,res)=>{
    res.sendFile(__dirname+'/register.html');
});
app.post('/register?',(req,res)=>{

    // // リクエストボディを出力
    // console.log(req.body);
    // // パラメータ名、idを出力 
    // console.log(req.body.id);
    // console.log(req.body.password);

    // サインイン中のユーザーテーブルを作成しておく。作成済みでも大丈夫みたい
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.createCollection("signin",(error,collection)=>{//コレクションはテーブルと同じ
            
    });
    });
    // 登録済みのユーザー一覧テーブルを作成しておく。
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.createCollection("products",(error,collection)=>{//コレクションはテーブルと同じ
            
    });
    });
    //　個人間チャットのテーブルを作る。
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.createCollection("1on1_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
            
    });
    });
    //　グループチャットのテーブルを作る。
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.createCollection("group_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
            
    });
    });

    // データベースへ登録する
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.collection("products",(error,collection)=>{//コレクションはテーブルと同じ
            
            collection.insertOne(
                {id: req.body.id,password: req.body.password}
                
            ),(error,result)=>{
                client.close();
            };


        });
    });

    //ログイン可能なユーザーをtxtに書き込む
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.collection("products",(error,collection)=>{//コレクションはテーブルと同じ
            collection.find().toArray((error,docs)=>{
                const stream = fs.createWriteStream("user.txt");
                for(let doc of docs){        
                    // console.log("型:"+typeof(doc.id));
                    stream.write(doc.id+"\n");
                   
                    // エラー処理
                    stream.on("error", (err)=>{
                        if(err)
                        console.log(err.message);
                    });
                } 
                stream.end("\n");
            
            });
            client.close();
        });
    });

    res.redirect('./login.html');
});

app.get('/login.html',(req,res)=>{
    res.sendFile(__dirname+'/login.html');
});
app.get('/style.css',(req,res)=>{
    res.sendFile(__dirname+'/style.css');
});
app.get('/indexUI.js',(req,res)=>{
    res.sendFile(__dirname+'/indexUI.js');
});

app.post('/login.html?',(req,res)=>{

    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.collection("products",(error,collection)=>{//コレクションはテーブルと同じ
            collection.find({$and:[{id: { $eq: req.body.id}},{password: { $eq: req.body.password }}] }).toArray((error,docs)=>{
                // console.log(docs.length);
                client.close();
                if(docs.length>0){//認証できたら
                    res.redirect('./index.html'+req.body.id);
                }else{
                    res.send('ユーザーIDかパスワードが間違っています。');
                    // res.sendFile(__dirname+'/login.html');
                }
            
    });
    });
    });
    
});
app.get('/index.html:id',(req,res)=>{
    res.sendFile(__dirname+'/index.html',{'name':"satou"});
});

app.get('/',(req,res)=>{
    res.redirect('./register');
});
app.get('/socket.js',(req,res)=>{
    res.sendFile(__dirname+'/socket.js');
});
app.get('/jquery-2.1.3.js',(req,res)=>{
    res.sendFile(__dirname+'/jquery-2.1.3.js');
});
app.get('/jquery-ui.js',(req,res)=>{
    res.sendFile(__dirname+'/jquery-ui.js');
});
app.get('/jquery-ui.css',(req,res)=>{
    res.sendFile(__dirname+'/jquery-ui.css');
});
app.get('/page02.html',(req,res)=>{
    res.sendFile(__dirname+'/page02.html');
});
app.get('/sceneManeger.js',(req,res)=>{
    res.sendFile(__dirname+'/sceneManeger.js');
});
app.get('/index_1on1.js',(req,res)=>{
    res.sendFile(__dirname+'/index_1on1.js');
});
app.get('/index_group.js',(req,res)=>{
    res.sendFile(__dirname+'/index_group.js');
});
http.listen(port,()=>{
    console.log(`listening on *:${port}`);
});

rooms=[];
names=[];
io.on('connection',(socket)=>{//個別にsocketが作られる。ページがリロードされるたびにsocketidは変わるのかも
    
    
    msgs=[];
    let one = new Person();
    let group= new Group();
     
    
    // urlのパラメータから誰がログインしているのか取得。
    console.log('a user connected');
    let url_name=socket.handshake.headers.referer;
    url_name=url_name.split("html");
    console.log("ＵＲＬネームは？"+url_name[1]);
    names[socket.id] =url_name[1];
    console.log("ログインユーザのsocket:id:"+socket.id);
    console.log(names);

    
    
    // 自分をログインテーブルに追加
    socket.on('insertUser',(name)=>{
    console.log("ログインするユーザー"+name);
    


    function userSignin(){
        return new Promise((resolve, reject)=>{
            let i;
            MongoClient.connect(url,(error,client)=>{
                var db = client.db("heroku_v52vjggz");
                    db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
                    i=collection.insertOne(
                        {id: name,socket_ID: socket.id}
                    ),(error,result)=>{     
                        client.close(); 
                    };
                    });
                    console.log(Boolean(i));// true　
                    if(Boolean(i)){// 本来この引数はＤＢへの登録が終わったらtrueになる。new promise以降が同期処理のようになってる。
                        resolve(i);
                    }else{
                        reject(i);
                    }
            });  //db接続終わり

        });// usesignin()終わり
    };// connection 終わり

    var promise=[];
    promise = userSignin();

    promise.then((value) => { //resolveが返って来るまで待つみたい。
        console.log(Boolean(value));
        let users=[];
        MongoClient.connect(url,(error,client)=>{
            var db = client.db("heroku_v52vjggz");
            db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
                collection.find().toArray((error,docs)=>{

                    console.log("現在のログインユーザー数:"+docs.length);

                    for(let doc of docs){
                        users.push(doc.id);
                    }
            console.log("ログイン後のユーザー"+users);
            // 自分自身を含む全員に送信。ここは同期処理のようなのでここでemitしておく。
            io.sockets.emit('insertUser',users);
            });
            });
            client.close();
        });   

    }, (error) => {
        console.error("error:", error.message);
    });
     



    //ログイン中のユーザー一覧を取得


    });// insertUser終わり
    
    socket.on('join room',(msg)=>{
        rooms[socket.id]=msg;
        socket.join(msg);
        console.log(socket.id+"さんが"+rooms[socket.id]+"に入室します。");
        for(var key in rooms) {
              var val = rooms[key];
              console.log("key=", key, ", value=", val);
          }
    });
    // socket.broadcast.to(rooms[socket.id]).emit('message','誰かが入室しました');

    socket.on('disconnect',()=>{
        // socket.idを削除する。
        delete names[socket.id];
        
        function userSignOut(){
            return new Promise((resolve, reject)=>{
                let i2;
                console.log('dbからログイン情報を削除します。'+url_name[1]);
                MongoClient.connect(url,(error,client)=>{
                    var db = client.db("heroku_v52vjggz");
                        db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
                        i2=collection.deleteMany(
                            {id: url_name[1]}
                        )
                    });                      
                    console.log(Boolean(i2));
                    if(Boolean(i2)){
                        resolve(i2);
                    }else{
                        reject(i2);
                    }

                }); // db接続終わり
            });  // return promise終わり
        }// userSignOut()　終わり

        var promise2=[];
        promise2 = userSignOut();


        promise2.then((value) => {
            console.log(Boolean(value));
            // ログアウト後の情報を全ユーザーに送る
            let users=[];
            MongoClient.connect(url,(error,client)=>{
                var db = client.db("heroku_v52vjggz");
                db.collection("signin",(error,collection)=>{
                    collection.find().toArray((error,docs)=>{
                        for(let doc of docs){
                            users.push(doc.id);
                        }
                    console.log("ログアウト後のユーザ一覧"+users);

                    // 自分自身を含む全員に送信。ここは同期処理のようなのでここでemitしておく。
                    io.sockets.emit('insertUser',users);
                });
                });
                client.close();
            });
                console.log('user disconnected');
                let name="誰か";
                if(names[socket.id]){name=names[socket.id];}
                socket.broadcast.to(rooms[socket.id]).emit('message',name+'が接続を切断しました。');
            },(error) => {
                console.error("error!!:"+error);
            });

    });

    socket.on('message',(msg)=>{
        console.log("今送ったメッセージ:"+msg);
        console.log("前送ったメッセージ:"+msgs[names[socket.id]]);
        if(!(names[socket.id])){//チャンネル名を指定しないとundefindになってしまう。
            names[socket.id]=url_name[1];    
        }
        console.log("送り主:"+names[socket.id]+"ソケットＩＤ:"+socket.id);
        if(msg == msgs[names[socket.id]] ){
            console.log("二重投稿です。他の人にメッセージを送りません。");
        }else{
            console.log("トークルーム名は:"+rooms[socket.id]);
            socket.broadcast.to(rooms[socket.id]).emit('message',names[socket.id]+"さんから:"+msg);
            console.log(rooms);
            if(!(rooms[socket.id])){
                socket.broadcast.emit('message',"(public)"+names[socket.id]+"さんから:"+msg);

            }
        }

    });
    socket.on('chat message',(msg)=>{
        names[socket.id] =msg;
        console.log("ニックネームをつけました。"+names[socket.id]);
        console.log("トークルーム名は:"+rooms[socket.id]);
        socket.broadcast.to(rooms[socket.id]).emit('message',">>"+names[socket.id]+'が入室しました');
        if(!(rooms[socket.id])){
            socket.broadcast.emit('message',">>"+"(public)"+names[socket.id]+'が入室しました');

        }
    });
    socket.on('message 2',(msg)=>{
        socket.broadcast.to(rooms[socket.id]).emit('message 2',names[socket.id]+'が入力中です。');
        socket.broadcast.emit('message 2',names[socket.id]+'が入力中です。');

    });

    socket.on('getUser',(msg)=>{
        // (ユーザーのサインイン、サインアウト更新情報は他の所。connected,disconnectedされたときに更新される。)
        let users=[];
        console.log("strt");
        // 自分自身を含む
        socket.emit('getUser',users);
        MongoClient.connect(url,(error,client)=>{
            var db = client.db("heroku_v52vjggz");
            db.collection("products",(error,collection)=>{//コレクションはテーブルと同じ
                collection.find().toArray((error,docs)=>{
                    for(let doc of docs){
                        users.push(doc.id);
                        // console.log(users);

                    }
            // socket.emitだと自分自身にしか送れなかった。ここは同期処理のようなのでここでemitしておく。
            io.sockets.emit('getUser',users);
            // socket.broadcast.emit('getUser',users);

            });
            });
            client.close();
        });
        
        //非同期なので、ここでemitするとＤＢの内容取得ができないでemitしてしまう。
        
    });

    //個人間チャット
    socket.on('1on1_tolkContents',(toName,msg)=>{
        one.enter(MongoClient,url,names,toName,msg,socket.id,io);
    });
    socket.on('1on1_message',(toUser,msg)=>{
        
        one.message(MongoClient,url,names,socket.id,io,toUser,msg);
    });
    //グループチャット
    socket.on('createRoom',(roomUsers,roomName)=>{
        console.log("グループチャット");
        group.enter(MongoClient,url,names,socket.id,io,roomUsers,roomName);

    });
    socket.on('group_message',(roomName,msg)=>{
        console.log("グループチャットメッセージ");
        group.message(MongoClient,url,names,socket.id,io,roomName,msg,rooms,socket);
    });
    socket.on('getRooms',()=>{
        
        let rooms=[];

        MongoClient.connect(url,(error,client)=>{
            var db = client.db("heroku_v52vjggz");
            db.collection("group_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                collection.find({$and:[{user: { $eq: names[socket.id]}},{contents: { $eq: "" }}] }).toArray((error,docs)=>{
                    console.log("ルーム数は？"+docs.length);
                    for(let doc of docs){
                        console.log(doc.roomName);
                        rooms.push(doc.roomName);
                        console.log(rooms);

                    }
            // socket.emitだと自分自身にしか送れなかった。ここは同期処理のようなのでここでemitしておく。
            socket.emit('getRooms',rooms);


            });
            });
            client.close();
        });
        
        //非同期なので、ここでemitするとＤＢの内容取得ができないでemitしてしまう。
        
    });
});