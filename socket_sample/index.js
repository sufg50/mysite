var app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');
const { equal } = require('assert');
var http = require('https').createServer(app);
var port = process.env.PORT;
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://heroku_v52vjggz:gjdrohmubrprcpjm81svdl2aq9@ds131432.mlab.com:31432/heroku_v52vjggz";
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

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

    // テーブルを作成しておく。作成済みでも大丈夫みたい
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("sample");
        db.createCollection("signin",(error,collection)=>{//コレクションはテーブルと同じ
            
    });
    });
    // テーブルを作成しておく。
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("sample");
        db.createCollection("products",(error,collection)=>{//コレクションはテーブルと同じ
            
    });
    });

    // データベースへ登録する
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("sample");
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
        var db = client.db("sample");
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


app.post('/login.html?',(req,res)=>{

    MongoClient.connect(url,(error,client)=>{
        var db = client.db("sample");
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

http.listen(3000,()=>{
    console.log(`listening on *:${port}`);
});
let room=[];
rooms=[];
io.on('connection',(socket)=>{//個別にsocketが作られる。ページがリロードされるたびにsocketidは変わるのかも
    
    names=[];
    msgs=[];
    
    console.log('a user connected');
    let url_name=socket.handshake.headers.referer;
    url_name=url_name.split("html");
    names[socket.id] =url_name[1];

    socket.on('insertUser',(name)=>{
    //自分をログインテーブルに追加
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("sample");
        db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
            collection.insertOne(
                {id: name}
            ),(error,result)=>{
                client.close();
            };
        });
    });

    //ログイン中のユーザー一覧を取得
    let users=[];
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("sample");
        db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
            collection.find().toArray((error,docs)=>{
                for(let doc of docs){
                    users.push(doc.id);
                    // console.log(users);

                }
        console.log(users);
        // 自分自身を含む全員に送信。ここは同期処理のようなのでここでemitしておく。
        io.sockets.emit('insertUser',users);
        });
        });
        client.close();
    });

    });
    
    socket.on('join room',(msg)=>{
        rooms[socket.id]=msg;
        socket.join(msg);
        console.log(socket.id+"さんが"+rooms[socket.id]+"に入室します。");
        console.log(rooms);

    });
    // socket.broadcast.to(rooms[socket.id]).emit('message','誰かが入室しました');

    socket.on('disconnect',()=>{

        console.log('dbからログイン情報を削除します。'+url_name[1]);
        MongoClient.connect(url,(error,client)=>{
            var db = client.db("sample");
            db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
                collection.deleteMany(
                    {id: url_name[1]}
                )
                
        });
        });
        // ログイン後の情報を全ユーザーに送る
        let users=[];
        MongoClient.connect(url,(error,client)=>{
            var db = client.db("sample");
            db.collection("signin",(error,collection)=>{//コレクションはテーブルと同じ
                collection.find().toArray((error,docs)=>{
                    for(let doc of docs){
                        users.push(doc.id);
                        // console.log(users);
    
                    }
            console.log(users);
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
    });



    
    socket.on('message',(msg)=>{
        console.log("今送ったメッセージ:"+msg);
        console.log("前送ったメッセージ:"+msgs[names[socket.id]]);
        if(!(names[socket.id])){//チャンネル名を指定しないとundefindになってしまう。
            names[socket.id]=url_name[1];    
        }
        console.log("送り主:"+names[socket.id]);
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
            var db = client.db("sample");
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
            // console.log(users);
            // console.log("数は：");
            // console.log(users.length);
        });
        
        //非同期なので、ここでemitするとＤＢの内容取得ができないでemitしてしまう。
        
    });

});