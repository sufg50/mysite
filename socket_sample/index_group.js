module.exports = class Group{
    constructor () {
        this.toUser;
        this.froUser;
    }
    
    enter(MongoClient,url,names,socket_id,io,roomUsers){
        let roommei="";
        let msg="";
        roomUsers.forEach(roomUser => {
            roommei+=roomUser;
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
                if(String(names[key])==String(contents_row[key2].user) && true==to){
                    io.to(key).emit('group_tolkContents', contents_row)
                    to=false;
                }
            }
            
        }
    },(error) => {
        console.error("error!!:"+error);
    });
     }
}