
module.exports = class Person{
    constructor () {
        this.toUser;
        this.froUser;
    }
    enter(MongoClient,url,names,toName,msg,socket_id,io){

    // データベースへ登録する
    MongoClient.connect(url,(error,client)=>{
        var db = client.db("heroku_v52vjggz");
        db.collection("1on1_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
            collection.find({$and:[{toUser: { $eq: String(toName)}},{fromUser: { $eq: String(names[socket_id])}}] }).toArray((error,docs)=>{
                collection.find({$and:[{toUser: { $eq: String(names[socket_id])}},{fromUser: { $eq:  String(toName)}}] }).toArray((error2,docs2)=>{       

                    if(docs.length<=0 && docs2.length<=0){//トークルームが作られていなければ。
                            collection.insertMany([
                                {toUser: String(toName),fromUser: String(names[socket_id]),contents: msg},
                                {toUser: String(names[socket_id]),fromUser: String(toName),contents: msg},
                            ],(error,result)=>{
                                client.close();
                            });                    
                    }
                });
            });
        });
    });

    let contents_row=[];

    function getContents_1on1(){
        return new Promise((resolve, reject)=>{
           
            let i3;

            
            // DBから過去のトーク内容をすべてfindで検索して取ってくる。
            MongoClient.connect(url,(error,client)=>{
                var db = client.db("heroku_v52vjggz");
                db.collection("1on1_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                    collection.find(
                        {$or: [{$and:[{toUser: { $eq: String(toName)}},{fromUser: { $eq:  String(names[socket_id])}}] },
                            {$and:[{toUser: { $eq: String(names[socket_id])}},{fromUser: { $eq:  String(toName)}}] }]}
                    ).toArray((error,docs)=>{
                        contents_row=docs;
                        for(let doc of contents_row){
                            console.log("DB検索一致:"+doc.contents+"。"+doc.toUser+"へ。"+doc.fromUser+"から。");
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
    promise3 = getContents_1on1();

    promise3.then((value) => {
        let to=true;
        let from=true;
        //ログイン中のユーザにはemitする必要がある。特定ユーザーのみに送る。
        for (let key2 in contents_row) {
            for (let key in names) {
                if(String(names[key])==String(contents_row[key2].toUser) && true==to){
                    io.to(key).emit('1on1_tolkContents', contents_row)
                    console.log("送り主を見つけた[socketid]"+key);
                    to=false;
                }
                if(String(names[key])==String(contents_row[key2].fromUser) && true==from){
                    io.to(key).emit('1on1_tolkContents', contents_row)
                    console.log("届ける人を見つけた[socketid]"+key);
                    from=false;
                }
            }
            
        }
    },(error) => {
        console.error("error!!:"+error);
    });
    }// enter終わり

    message=(MongoClient,url,names,socket_id,io,toUser,msg)  => {
        console.log(toUser+"へ。"+msg);
        // データベースへ登録する
        function touroku(){
            let tourokuok;
            return new Promise((resolve, reject)=>{
                MongoClient.connect(url,(error,client)=>{
                    var db = client.db("heroku_v52vjggz");
                    db.collection("1on1_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                        tourokuok=collection.insertOne(
                                {toUser: String(toUser),fromUser: String(names[socket_id]),contents: msg}
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

    function getContents_1on1(){
        return new Promise((resolve, reject)=>{
           
            let i3;

            
            // DBから過去のトーク内容をすべてfindで検索して取ってくる。
            MongoClient.connect(url,(error,client)=>{
                var db = client.db("heroku_v52vjggz");
                db.collection("1on1_tolkContents",(error,collection)=>{//コレクションはテーブルと同じ
                    collection.find(
                        {$or: [{$and:[{toUser: { $eq: String(toUser)}},{fromUser: { $eq:  String(names[socket_id])}}] },
                            {$and:[{toUser: { $eq: String(names[socket_id])}},{fromUser: { $eq:  String(toUser)}}] }]}
                    ).toArray((error,docs)=>{
                        contents_row=docs;
                        for(let doc of contents_row){
                            console.log("DB検索一致:"+doc.contents+"。"+doc.toUser+"へ。"+doc.fromUser+"から。");
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
    }// getContents_1on1()　終わり

    var promise=[];
    var promise3=[];
    promise=touroku();

    promise.then((value)=>{   
        promise3 = getContents_1on1();
        promise3.then((value) => {
            let to=true;
            let from=true;
            //ログイン中のユーザにはemitする必要がある。特定ユーザーのみに送る。
            for (let key2 in contents_row) {
                for (let key in names) {
                    if(String(names[key])==String(contents_row[key2].toUser) && true==to){
                        io.to(key).emit('1on1_tolkContents', contents_row)
                        console.log("送り主を見つけた[socketid]"+key);
                        to=false;
                    }
                    if(String(names[key])==String(contents_row[key2].fromUser) && true==from){
                        io.to(key).emit('1on1_tolkContents', contents_row)
                        console.log("届ける人を見つけた[socketid]"+key);
                        from=false;
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


