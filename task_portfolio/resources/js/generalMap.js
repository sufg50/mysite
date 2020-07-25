export default class GeneralMap{
    
    getCSV(num){
        console.log("generalMapが読み込まれました！");
        var self = this;// thisをselfに代入する理由→https://anz-note.tumblr.com/post/81446635196/javascriptでクラスのメソッド内の関数から自身のメソッドを呼ぶには-ω
        return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "/storage/mapdata/test"+num+".csv", true); // 非同期でファイルを読み込む。同期処理はできない。req.onloadがあるからだと思う

        // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
        req.onload = function(){　
            if (req.readyState === 4){
                resolve(self.convertCSVtoArray(req.responseText)); // 渡されるのは読み込んだCSVデータ 
            }else{
                req.onerror=function(){
                reject(new Error(req.statusText));
                }
            }
        }   
        req.send(null); // HTTPリクエストの発行(サーバーにデータを送る)
    });
    }// getCSV終わり


    // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
    convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
        var result = []; // 最終的な二次元配列を入れるための配列
        var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
        // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
        for(var i=0;i<tmp.length-1;++i){//tmp.lengthに-1をするのは、何も入ってない行をいれないため
            result[i] = tmp[i].split(',');
        }
        
        return result;

    }
    getRainFallCSV(game){
        console.log("雨量が読み込まれました！");
        var self = this;// thisをselfに代入する理由→https://anz-note.tumblr.com/post/81446635196/javascriptでクラスのメソッド内の関数から自身のメソッドを呼ぶには-ω
        return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
        req.open("get", "/storage/mapdata/rainfall2.csv", true); // 非同期でファイルを読み込む。同期処理はできない。req.onloadがあるからだと思う

        // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
        req.onload = function(){　
            if (req.readyState === 4){
                resolve(self.convertCSVtoArray2(req.responseText,game)); // 渡されるのは読み込んだCSVデータ 
            }else{
                req.onerror=function(){
                reject(new Error(req.statusText));
                }
            }
        }   
        req.send(null); // HTTPリクエストの発行(サーバーにデータを送る)
    });
    }// getCSV終わり


    // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
    convertCSVtoArray2(str,game){ // 読み込んだCSVデータが文字列として渡される
        var result = {}; // 最終的な二次元配列を入れるための配列
        var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
        // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
        for(var i=0;i<tmp.length-1;++i){//tmp.lengthに-1をするのは、何も入ってない行をいれないため
            result[tmp[i].split(',')[0]] = tmp[i].split(',')[1];
        }
        // 雨量の更新日時を取得
        this.getDate(tmp[1].split(',')[2],game);
        
        return result;

    }

    getDate(date,game){
        game.rainfallsDate=date;
    }

}