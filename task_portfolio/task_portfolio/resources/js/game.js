import Player from './Player';
import ItemMap from './itemmap';
import BackGroundMap from './backgroundMap';
import GeneralMap from './generalMap';
import ViewArea from './viewArea';
import EnemyMap from './enemyMap';
import TextArea from './textArea';
import SceneManeger from './sceneManeger';





// 最初にマップが非同期で読み込まれ、
// マップの読み込み(promise)が完了と同時にプレイヤエリアにマップエリアの一部がダウンロードされる感じ
// keyイベントを待ち続けるループがあり、入力があったら画面データを更新する。
// 描画処理はループされる。
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const ENTER = 13;
const ESC=27;
const Z=90;

const ViewWidth=13;
const ViewHeight=17;
let scroll;

export default class Game{
    constructor() {
        
        this.mapArea=[]; //衝突判定や、playerMoveでの階段イベントに使う
        this.app = new PIXI.Application({
            width: 720,                 // スクリーン(ビュー)横幅 
            height: 528,                // スクリーン(ビュー)縦幅  
            backgroundColor: 0x000000,  // 背景色 16進 0xRRGGBB
            autoDensity: true,   
        });
        //htmlのapp要素にキャンバスを入れる感じ
        this.el = document.getElementById('app');
        this.audio = document.getElementById('audio');
        this.el.appendChild(this.app.view);
        this.dirValue="0";
        this.playerValue="p";
        this.gameScene1 = new PIXI.Container(); //背景とアイテムのテクスチャコンテナ
        this.weatherContainer = new PIXI.Container(); //雨雲のコンテナ
        this.rainContainer =new PIXI.Container();
        this.weatherContainer.zIndex=10;//コンテナにインデックスつけると良い感じなのかも
        this.rainContainer.zIndex=90;
        this.weatherContainer.sortableChildren =true;
        this.moveflag=true;
        this.dungeonMoveFlag=false;
        this.dungeonLevel=1; //何階層のマップを読み込むか
        this.floorChoice=true;
        this.sceneDungeon1 = true;
        this.sceneTown=false;
        this.kansokujoNames=[];// 観測所のエフェクトに使用,地名、雨量の連想配列


        // サウンド関連
        this.stepsSound = PIXI.sound.Sound.from('/storage/music/load.wav');
        this.decisionSound = PIXI.sound.Sound.from('/storage/music/decision22.mp3');
        this.choiseButtonSound=PIXI.sound.Sound.from('/storage/music/button06.mp3');
        this.moneyPickUpSound=PIXI.sound.Sound.from('/storage/music/coin01.mp3');
        this.toriSound=PIXI.sound.Sound.from('/storage/music/tori.mp3');
        this.playerAttackSound=PIXI.sound.Sound.from('/storage/music/short_punch1.mp3');
        this.playerAttackSound.volume=0.5;
        this.toriSound.volume =0.6;
        this.stepsSound.volume = 0.12;
        this.choiseButtonSound.volume = 0.5;
        this.moneyPickUpSound.volume = 0.1;
        
        //フィルター
        this.pixelateFilter =new PIXI.filters.PixelateFilter();
        this.pixelateFilter.size = 2; //ドット荒さ
        this.glowFilter=new PIXI.filters.GlowFilter({ distance: 15, outerStrength: 10,color: 0xffffff});


        this.tween1;

        // 画像関連
        this.loader = new PIXI.Loader(); // 外部ファイルで画像の読み込みしたいときに使える
        this.floorChoice=true;

        // アメダス関連
        this.rainfalls;
        this.rainfallsDate;
        
    } 


    // 移動しないものの描画。backgrand.jsやitemMap.jsから呼び出される。
    createMapchipSprite(Texture,i,j,offsetX,offsetY,zIn){
        let ele = new PIXI.Sprite(Texture);
        ele.scale.x = ele.scale.y = 1.5; //　元々の画像が32pxのばかり使ってるのため、48pxは想定外
        ele.x = (j * 48)-48+offsetX;   //-48は左右に1マスずつ余分にとってるから,LEFTならoffsetは-48,
        ele.y = (i * 48)-48+offsetY;
        this.gameScene1.zIndex=zIn;
        this.gameScene1.addChild(ele); //コンテナにスプライトを入れる
        this.app.stage.addChild(this.gameScene1);　//ステージにコンテナを入れる
        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        x: ele.x + -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        x: ele.x + 48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        y: ele.y  -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }   else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        y: ele.y +48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }         
    }// createMapchipSprite終わり

    MapChipKansokujoWeather(kansokujoName,i,j,offsetX,offsetY,zIn,player){
    //エクセルファイルから雨量を読み込む。
    this.rainContainer.filters=[this.glowFilter];
    let uryou=0;
    let cloudColor=0xffffff;
    if(typeof(this.rainfalls[kansokujoName]) != "undefined"){
        uryou=Math.round(parseFloat(this.rainfalls[kansokujoName]))*2;
        if(uryou != 0){
            cloudColor=0xc0c0c0;
        }
    }

    //雲を描く
        this.weatherContainer.filters = [this.pixelateFilter];
        let kansokujo_weather = new PIXI.Graphics()//白ぶち
        .beginFill(cloudColor, 1)     //白,透明度
        .lineStyle(1, 0x000000) //黒
        .drawPolygon([  // 頂点を配列で渡す [x1,y1,x2,y2,....]
            10, 5,    //左上
            0, 21,   //左真ん中
            10, 37,  //左下
            38, 37,  // 右下
            48, 21,  //　右真ん中
            38, 5,  //右上

        ])
        .endFill();
        kansokujo_weather.x = (j * 48)-48+offsetX;
        kansokujo_weather.y = (i * 48)-96+offsetY;
        kansokujo_weather.zIndex=zIn;
        this.weatherContainer.addChild(kansokujo_weather); //コンテナにスプライトを入れる
        
        this.app.stage.addChild(this.weatherContainer);
        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(kansokujo_weather, 0.125, 
                {   
                    pixi: { 
                        x: kansokujo_weather.x + -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(kansokujo_weather, 0.125, 
                {   
                    pixi: { 
                        x: kansokujo_weather.x + 48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(kansokujo_weather, 0.125, 
                {   
                    pixi: { 
                        y: kansokujo_weather.y  -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }   else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(kansokujo_weather, 0.125, 
                {   
                    pixi: { 
                        y: kansokujo_weather.y +48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }
    

    // エフェクトの描画を一回のみにする。
    // let weatherEffect=true;
    // if(this.kansokujoNames.includes(kansokujoName)){// includesの引数の値が含まれていればtrueを返す。
    //     weatherEffect=false;
    // }else{
    //     this.kansokujoNames.push(kansokujoName);
    // }
    // this.app.stage.addChild(this.rainContainer);
    // if(weatherEffect){
    
    // 雨のｘ軸の位置がおかしいため修正をほどこす。
    let weatherOffsetFix=0;
    if(player.animeDir=="RIGHT"){
        weatherOffsetFix=-48;
    }
    if(player.animeDir=="LEFT"){
        weatherOffsetFix=48;

    }


   //雨 線を描く
    for(let c=0;c<uryou;c++){

        
        let line = new PIXI.Graphics()
        .lineStyle(1, 0x0000FF)   // 線のスタイル指定(幅, 色) これ以外に透明度, alignment(線の位置)などが指定可能
        .moveTo(10,25)              // 開始点に移動
        .lineTo(10,40)             // (x,y)に向かって直線を引く      
        line.x = (j * 48)-48+offsetX;
        line.y = (i * 48)-100;
        line.zIndex=zIn;
        this.rainContainer.addChild(line); //コンテナにスプライトを入れる
        this.app.stage.addChild(this.rainContainer);
        
        let tween1=TweenMax.to(line, 0.5, //完了までの時間
        {   
            pixi: { 
                y: line.y +40, 

            },
            ease: Power1.easeInOut, 
            repeat: -1,
            repeatDelay: ( Math.random() * 1),
            yoyo: true,
            onRepeat: function(){
                // 画面全体に反映されるバージョン。何か雨が下の画面にたまるバグがある。
                // line.y = Math.floor( Math.random() * 528);
                // line.x = Math.floor( Math.random() * 720);
               

                // 雲の下に反映されるバージョン
                line.x = (j * 48)-48+offsetX+Math.floor( Math.random() * 48)-8+weatherOffsetFix;
                tween1.restart(true,true);

                
                
            },

        }
        ); //tween終わり

        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(line, 0.125, 
                {   
                    pixi: { 
                        x: line.x + -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(line, 0.125, 
                {   
                    pixi: { 
                        x: line.x + 48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(line, 0.125, 
                {   
                    pixi: { 
                        y: line.y  -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }   else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(line, 0.125, 
                {   
                    pixi: { 
                        y: line.y +48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }
    // } // if文。weatherEffect終わり。
}// for終わり

// setTimeout(() => { tween1.pause() }, 1000);
 
}// MapChipKansokujoWeather終わり

    MapChipKansokujo(kansokujoName,i,j,offsetX,offsetY,zIn){
        //枠
        let kansokujo_waku = new PIXI.Graphics()//白ぶち
        .beginFill(0xFFFFFF, 1)     //白,透明度
        .lineStyle(1, 0x000000) //黒
        .drawPolygon([  // 頂点を配列で渡す [x1,y1,x2,y2,....]
            0, 9,    //左上
            0, 36,   //左下
            48, 36,  //右下
            48, 9,　 //右上
        ])
        .endFill();
        kansokujo_waku.x = (j * 48)-48+offsetX;
        kansokujo_waku.y = (i * 48)-48+offsetY;
        kansokujo_waku.zIndex=zIn;
        this.gameScene1.addChild(kansokujo_waku); //コンテナにスプライトを入れる
        this.app.stage.addChild(this.gameScene1);
        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(kansokujo_waku, 0.125, 
                {   
                    pixi: { 
                        x: kansokujo_waku.x + -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(kansokujo_waku, 0.125, 
                {   
                    pixi: { 
                        x: kansokujo_waku.x + 48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(kansokujo_waku, 0.125, 
                {   
                    pixi: { 
                        y: kansokujo_waku.y  -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }   else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(kansokujo_waku, 0.125, 
                {   
                    pixi: { 
                        y: kansokujo_waku.y +48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }        

        //テキスト
        let fontookisa=15;
        if(kansokujoName.length>3){
            fontookisa=11;
        }
        let textx=0;
        if(kansokujoName.length==2){
            textx=6;
        }
        let ele =  new PIXI.Text(kansokujoName, 
                { 
                  fontFamily: 'メイリオ',   // フォント
                  fontSize: fontookisa,// 4文字の時は11,3文字の時は15で枠内に収まる
                  fill : 0x000000,       // 文字色
                  stroke: 0x000000,      // アウトラインの色
                  strokeThickness: 0.5,    // アウトラインの太さ   
                //   align: 'center',       // 文字揃え(複数行の場合に有効)     
                });
        ele.x = (j * 48)-48+textx+offsetX;   //-48は左右に1マスずつ余分にとってるから,LEFTならoffsetは-48,
        ele.y = (i * 48)-37+offsetY;
        this.gameScene1.zIndex=zIn;
        this.gameScene1.addChild(ele); //コンテナにスプライトを入れる
        this.app.stage.addChild(this.gameScene1);　//ステージにコンテナを入れる
        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        x: ele.x + -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        x: ele.x + 48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        y: ele.y  -48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }   else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(ele, 0.125, 
                {   
                    pixi: { 
                        y: ele.y +48, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }         

}//MapChipKansokujo終わり

    itemPickUp(itemMapArea,x,y,player){
        if(itemMapArea[x][y] == "money"){
            player.items.push(itemMapArea[x][y]);//プレイヤの持ち物に追加する。
            itemMapArea[x][y] = "0";
            this.moneyPickUpSound.play();
            player.money += Math.floor(Math.random()*200)+100;

        }
    }// itemPickUp終わり
    
    playerMoveEvent(px,py,textArea,game){
        if(this.mapArea[px][py]=="2"){
            this.choiseButtonSound.play();
            this.dungeonMoveFlag = true;
            this.floorChoice = true;
            // this.sceneDungeon1 = true;
            textArea.kaisouMove(game,'下る     そのまま');  
        }
        if(this.mapArea[px][py]=="3"){
            this.choiseButtonSound.play();
            this.dungeonMoveFlag = true;
            this.floorChoice = true;
            this.sceneDungeon1 = false;
            this.sceneTown = true;
            textArea.kaisouMove(game,'上る     そのまま');  
    }
    if(this.mapArea[px][py]=="4"){
        this.choiseButtonSound.play();
        this.dungeonMoveFlag = true;
        this.floorChoice = true;
        this.sceneDungeon1 = true;
        this.sceneTown = false;
        this.dungeonLevel=0;
        textArea.kaisouMove(game,'入る     そのまま');  

}

    }// playerMoveEvent終わり
    

    playerCollision(direction,player,item,background,game,viewArea,enemy,enemys,textArea){
        // キーが押されたとき、衝突判定をマップで行い、移動できるのであればマップのpの位置を変更する。
        // getPlayerArea(更新されたマップ)と関数に渡せば新たなcurrentAreaが返される。
        // だからプレイヤーの座標をもつクラス作らないといけない
        

        switch(direction){
            case Z:
                background.createTexture_from_currentArea(0,0,game,player,textArea);//背景スクロールはせず,
                player.walkAnimetion(player.animeDir,6,8,game);// プレイヤの向いている方向のアニメーションを表示して、
                item.createItemMapTexture(item.currentArea,0,0,game);// 表示するアイテムを変更せず
                enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);//ローカルエリアにいる敵エネミーフラグをtrueにして、
                
                if(this.sceneDungeon1){
                    player.attack(game,player.animeDir,player.mvCharacterAnime[0],enemy,enemys);//先にプレイヤの攻撃を処理して、    
                    enemy.AI2(enemys,player,game,player.animeDir,textArea);// エネミーを移動または攻撃する
                }
                
                    
                //ここのところdisplayGroupみたいなものを使ってコンテナにzIndexを付けて管理する必要がある。

                break;

            case LEFT:
                console.log("LEFT");
                if(this.mapArea[player.getX()][player.getY()-1] != '9' 
                    && enemy.enemyMap[player.getX()][player.getY()-1] != "enemy1" ){// エネミーワールドマップで判定


                    // //テスト
                    // item.itemMap.forEach(element => {
                    //     console.log(element)
                    // });
                    
                    // プレイヤのワールド座標の更新
                    player.set(player.getX(),player.getY()-1);

                    
                    // イベント
                    this.itemPickUp(item.itemMap,player.getX(),player.getY(),player);

                    // ローカルマップの更新
                    background.currentArea=viewArea.getPlayerArea(this.mapArea,player);
                    item.currentArea=viewArea.getPlayerArea(item.itemMap,player);
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);

                    // 動かないものをスクロールする。
                    background.createTexture_from_currentArea(-48,0,game,player,textArea);
                    item.createItemMapTexture(item.currentArea,-48,0,game);

                    
                    if(this.sceneDungeon1){
                    // エネミーの行動
                    enemy.AI(enemys,player,game,direction,textArea);
                    }

                    // プレイヤが向いている方向のアニメーション
                    player.walkAnimetion("LEFT",6,8,game);

                    // イベント
                    this.playerMoveEvent(player.getX(),player.getY(),textArea,game);


                    return true;
                
                }else{
                    background.createTexture_from_currentArea(0,0,game,player,textArea);//背景スクロールはせず,
                    player.walkAnimetion("LEFT",6,8,game);// プレイヤの向きだけ変え,
                    item.createItemMapTexture(item.currentArea,0,0,game);// 表示するアイテムを変更せず,
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);//ローカルエリアにいる敵エネミーフラグをtrueにして、
                    enemy.createEnemyTexture(enemy.currentArea,0,0,game,enemys);// ローカルエリアにいるエネミーを表示する
                }
                break;
            case UP:
                console.log("UP");
                if(this.mapArea[player.getX()-1][player.getY()] != '9'
                    && enemy.enemyMap[player.getX()-1][player.getY()] != "enemy1" ){
                    // //テスト
                    // item.itemMap.forEach(element => {
                    //     console.log(element)
                    // });
                    // プレイヤのワールド座標の更新
                    player.set(player.getX()-1,player.getY());
                   
                    //イベント
                    this.itemPickUp(item.itemMap,player.getX(),player.getY(),player); 
                    
                    // ローカルマップの更新
                    background.currentArea=viewArea.getPlayerArea(this.mapArea,player);
                    item.currentArea=viewArea.getPlayerArea(item.itemMap,player);
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);

                    // 動かないものをスクロールする。
                    background.createTexture_from_currentArea(0,-48,game,player,textArea);
                    item.createItemMapTexture(item.currentArea,0,-48,game);

                   
                    if(this.sceneDungeon1){
                    // エネミーの行動
                    enemy.AI(enemys,player,game,direction,textArea);
                    }
                   
                    // プレイヤが向いている方向のアニメーション
                    player.walkAnimetion("UP",6,8,game);

                    //イベント、コンテナに追加した順に重なりが決まるためテキストエリアの表示は最後に持ってくる。
                    this.playerMoveEvent(player.getX(),player.getY(),textArea,game);

                    return true;
                
                }else{
                    background.createTexture_from_currentArea(0,0,game,player,textArea);
                    player.walkAnimetion("UP",6,8,game);
                    item.createItemMapTexture(item.currentArea,0,0,game);
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);
                    enemy.createEnemyTexture(enemy.currentArea,0,0,game,enemys);
                    // enemy.AI(enemys,player,game,direction);

                }

                break;
            case RIGHT:
                console.log("RIGHT");
                if(this.mapArea[player.getX()][player.getY()+1] != '9'
                    && enemy.enemyMap[player.getX()][player.getY()+1] != "enemy1" ){
                    //テスト
                    // item.itemMap.forEach(element => {
                    //     console.log(element)
                    // });
                    // プレイヤのワールド座標の更新
                    player.set(player.getX(),player.getY()+1);

                    //イベント
                    this.itemPickUp(item.itemMap,player.getX(),player.getY(),player);

                    // ローカルマップの更新
                    background.currentArea=viewArea.getPlayerArea(this.mapArea,player);
                    item.currentArea=viewArea.getPlayerArea(item.itemMap,player);
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);

                    //動かないものをスクロールする
                    background.createTexture_from_currentArea(48,0,game,player,textArea);
                    item.createItemMapTexture(item.currentArea,48,0,game);

                    // エネミーの行動
                    if(this.sceneDungeon1){
                    // エネミーの行動
                    enemy.AI(enemys,player,game,direction,textArea);
                    }

                     // プレイヤが向いている方向のアニメーション
                    player.walkAnimetion("RIGHT",6,8,game);

                    //イベント
                    this.playerMoveEvent(player.getX(),player.getY(),textArea,game);


                    return true;
                
                }else{
                    background.createTexture_from_currentArea(0,0,game,player,textArea);
                    player.walkAnimetion("RIGHT",6,8,game);
                    item.createItemMapTexture(item.currentArea,0,0,game);
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);
                    enemy.createEnemyTexture(enemy.currentArea,0,0,game,enemys);
                    // enemy.AI(enemys,player,game,direction);

                }

                break;
            case DOWN:
                console.log("DOWN");
                if(this.mapArea[player.getX()+1][player.getY()] != '9'
                    && enemy.enemyMap[player.getX()+1][player.getY()] != "enemy1" ){
                    //テスト
                    // item.itemMap.forEach(element => {
                    //     console.log(element)
                    // });
                    // プレイヤのワールド座標の更新
                    player.set(player.getX()+1,player.getY());//プレイヤが向いている方向の座標をセットする

                    // イベント
                    this.itemPickUp(item.itemMap,player.getX(),player.getY(),player);

                    
                    
                    // ローカルマップの更新
                    background.currentArea=viewArea.getPlayerArea(this.mapArea,player);
                    item.currentArea=viewArea.getPlayerArea(item.itemMap,player);
                    enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);

                    //テスト
                    enemy.currentArea.forEach(element => {
                        console.log(element);
                    });
                    

                    for(let i=0;i<enemys.length;i++){
                        console.log("エネミーワールド座標"+enemys[i].x+","+enemys[i].y);
                        console.log("エネミーローカル座標:"+enemys[i].localX+","+enemys[i].localY);
                        // console.log("エネミーの存在チェック:"+enemys[i].exist);            
                    }

                    //スプライトを格納した配列によって移動描画が行われているので、スプライトも更新する
                    background.createTexture_from_currentArea(0,48,game,player,textArea);
                    item.createItemMapTexture(item.currentArea,0,48,game);

                    if(this.sceneDungeon1){
                    // エネミーの行動
                    enemy.AI(enemys,player,game,direction,textArea);
                    }


                    // プレイヤが向いている方向のアニメーション
                    player.walkAnimetion("DOWN",6,8,game);

                    // イベント
                    this.playerMoveEvent(player.getX(),player.getY(),textArea,game);


                    console.log("enemys消去テスト3");
                    console.log(enemys);
                    return true;
                
                }else{
                background.createTexture_from_currentArea(0,0,game,player,textArea);   
                player.walkAnimetion("DOWN",6,8,game); 
                item.createItemMapTexture(item.currentArea,0,0,game);
                enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);
                console.log("enemys消去テスト4");
                enemy.currentArea.forEach(element => {
                    console.log(element);
                });
                enemy.createEnemyTexture(enemy.currentArea,0,0,game,enemys);

                }
                break;
            default:
                console.log("playerCollision:その他");
                return false;
        }
        return false;
    }//playerCollision終わり

    fadeIn(container,sprite,player){
        sprite.visible = true;
        container.visible = true;
        sprite.alpha = sprite.alpha + 0.1;
        container.alpha=container.alpha+0.1;
        
  
        if (sprite.alpha >= 1) {
            sprite.alpha =1;
            container.alpha=1;
            return;
        }
        setTimeout(() => {
          this.fadeIn(sprite,container,player);
        }, 100);
      };//fadeIn終わり


    // Load(player,item,background,game,viewArea,textArea,enemys,enemy){
        
    //     // ステージをリセットする。
    //     this.app.stage.removeChildren();
    //     this.gameScene1.removeChildren();

    //     // 新しいマップの読み込み。
    //     var promise=[];
    //     let generalMap =new GeneralMap(); 
    //     promise = generalMap.getCSV(this.dungeonLevel);

    //     // 初期化とか
    //     player.hp=20;
    //     this.dungeonLevel++;
    //     player.mvCharacterAnime[0].animationSpeed = 0.035;
    //     this.dungeonMoveFlag=false; // 初期表示時は階段の上にいないのでfalseにしておく。
        

    //     promise.then((value) => {
            
    //         //新しいマップからローカル背景エリアを設定。
    //         background.currentArea=viewArea.getFirstPlayerArea(value,player,"p");
    //         this.mapArea=(value); 

    //         //アイテムの再配置。
    //         item.setItemMap(this.mapArea); 
    //         item.currentArea=viewArea.getFirstPlayerArea(item.itemMap,player,"p");// //コピーした配列の中にはpが入っているのでそこを中心としたitemCurrenetAreaを設定する。
            
    //         // エネミーの再配置
    //         enemy.setEnemyMap(value,enemys);//エネミーにワールド座標を設定する。
    //         enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);// ローカル座標も設定する
    //         for(let i=0;i<enemys.length;i++){
    //             enemy.enemyAnimation("FRONT",enemys[i],game);
    //         }

    //         // 初期画面を表示、drawの代わり。
    //         this.playerCollision(DOWN,player,item,background,game,viewArea,enemy,enemys,textArea);

    //         // フェードイン
    //         player.mvCharacterAnime[0].alpha=0;// フェードインが始まる前にプレイヤを見えなくしておく。
    //         this.fadeIn(player.mvCharacterAnime[0],this.gameScene1,player); // フェードイン終了後に入力を受け付けるようにしてある。

            
    //     }, (error) => {
    //         console.error("error:", error.message);
    //     });
    // }


    //シーン遷移テスト
    fadeOut(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy){
      sprite.alpha = sprite.alpha - 0.1;
      container.alpha=container.alpha-0.1;
      if (sprite.alpha <= 0) {
        sprite.visible = false;
        container.visible = false;
        this.Load(player,item,background,game,viewArea,textArea,enemys,enemy);// ここでcontainer,spriteを渡しても初期描画で上書きされるかもしれない
        return;
      }
      setTimeout(() => {
        this.fadeOut(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy);
      }, 100);
    };

    // メインループ
    draw(game,player,item,background,viewArea,enemy,enemys,textArea) {
    // 背景の設置
    background.createTexture_from_currentArea(0,0,game,player,textArea);

    // アイテムの設置
    item.createItemMapTexture(item.currentArea,0,0,game)

    // 敵の設置,アニメーションの開始
    enemy.createEnemyTexture(enemy.currentArea,0,0,game,enemys);

    // 固定描画(HPと所持金と持ち物)の表示
    textArea.gold(player,game);
    textArea.hp(player,game);

    

    // プレイヤの設置とプレイヤアニメーションの開始
    player.walkAnimetion("FRONT",6,8,game);
    player.mvCharacterAnime[0].animationSpeed = 0.035;
    this.app.stage.addChild(this.gameScene1);
    let pushed = [];
    pushed[LEFT] = false;
    pushed[UP] = false;
    pushed[RIGHT] = false;
    pushed[DOWN] = false;
    pushed[ENTER] = false;
    pushed[ESC] = false;
    pushed[Z]=false;

    this.moveflag=true;

   
    

    // あるキーが押されたときのイベントリスナーを設定
    window.addEventListener('keydown', function(e) {
        pushed[e.keyCode] = true;
    });
    
    // あるキーが離されたときのイベントリスナーを設定
    window.addEventListener('keyup', function(e) {
        pushed[e.keyCode] = false;
    });
    
    let frameCount = 0;
    this.app.ticker.add((delta) => { //キー入力があればループ 
        // backgroundMap.jsでremovechildrenで全部初期化してしまっているため再表示を繰り返す。
        // this.gold(player);


        frameCount += delta;
        //deltaは大体1秒に60カウントなので10だと1秒に６回の入力を受け付ける
        if( frameCount >= 8) {   

        if(this.dungeonMoveFlag){// ここでthis.dungeonMoveFlagがtrueなら移動だけ禁止して降りるかどうかの選択メニューをだせるようにする
            
            //降りるかどうか決定されたとき。
            if(pushed[ENTER]){
                if(this.floorChoice){// 選択肢下る,上る
                    
                    this.app.stage.removeChild(textArea.kaisouCircle);
                    this.app.stage.removeChild(textArea.kaisouText);
                    this.app.stage.removeChild(textArea.choiceTriangle);
                    frameCount = 0;
                    this.dungeonMoveFlag=false;
                    this.moveflag = true;
                    
                    let scene = new SceneManeger();
                    if(this.sceneDungeon1){
                        scene.sceneDungeon1(this.gameScene1,player.mvCharacterAnime[0],player,item,background,game,viewArea,textArea,enemys,enemy);
                    }
                    if(this.sceneTown){
                        scene.sceneTown(this.gameScene1,player.mvCharacterAnime[0],player,item,background,game,viewArea,textArea,enemys,enemy);
                    }
                    this.stepsSound.play();
                }else if(!(this.floorChoice)){// 選択肢そのまま
                    this.app.stage.removeChild(textArea.kaisouCircle);
                    this.app.stage.removeChild(textArea.kaisouText);
                    this.app.stage.removeChild(textArea.choiceTriangle);
                    frameCount = 0;
                    this.dungeonMoveFlag=false;
                    this.moveflag = true;
                }
            }//降りるかどうかの決定終わり

            // 降りるかどうか選択中のとき
            if(pushed[LEFT]){// 選択肢。
                if(!this.floorChoice){this.choiseButtonSound.play();}
                this.floorChoice=true;
                textArea.choiceTriangle.x = textArea.kaisouText.x-15;

            }
            if(pushed[RIGHT]){// 選択肢
                if(this.floorChoice){this.choiseButtonSound.play();}
                this.floorChoice=false;
                textArea.choiceTriangle.x = textArea.kaisouText.x+70;

            }
            
        }

        if (pushed[LEFT] && this.moveflag && this.dungeonMoveFlag == false) {
            console.log("レフト！");
            // ←キーが押されていた場合              
                this.moveflag = this.playerCollision(LEFT,player,item,background,game,viewArea,enemy,enemys,textArea);//衝突判定等
                frameCount = 0;
                this.moveflag = false;
                // if(player.animeDir!=pushed[LEFT])
                setTimeout(() => {
                    player.mvCharacterAnime[0].animationSpeed = 0.035; // 歩行アニメーション終了後に遅くする。
                }, 125);
            

        }
        if (pushed[UP] && this.moveflag && this.dungeonMoveFlag == false) {
            // ↑キーが押されていた場合
            this.playerCollision(UP,player,item,background,game,viewArea,enemy,enemys,textArea);//衝突判定等
            frameCount = 0;
            this.moveflag = false;
            
            setTimeout(() => {
                player.mvCharacterAnime[0].animationSpeed = 0.035; // アニメーション速                
            }, 125);


        }
        if (pushed[RIGHT] && this.moveflag && this.dungeonMoveFlag == false) {
            // →キーが押されていた場合
            this.playerCollision(RIGHT,player,item,background,game,viewArea,enemy,enemys,textArea);//衝突判定等
            frameCount = 0;
            this.moveflag = false;
            setTimeout(() => {
                player.mvCharacterAnime[0].animationSpeed = 0.035; // アニメーション速                
            }, 125);

        }
        if (pushed[DOWN] && this.moveflag && this.dungeonMoveFlag == false) {

            // ↓キーが押されていた場合
            this.playerCollision(DOWN,player,item,background,game,viewArea,enemy,enemys,textArea);//衝突判定等
            frameCount = 0;
            this.moveflag = false;
            setTimeout(() => {
                player.mvCharacterAnime[0].animationSpeed = 0.035; // アニメーション速                
            }, 125);

        }
        if(pushed[ESC] && this.moveflag && this.dungeonMoveFlag == false){
            console.log("ESC!");
            player.mvCharacterAnime[0].stop();
            frameCount = 0;
            
        }
        if(pushed[Z] && this.moveflag && this.dungeonMoveFlag == false){
            this.playerCollision(Z,player,item,background,game,viewArea,enemy,enemys,textArea);//衝突判定等
            frameCount = 0;
            this.moveflag = false;
            
            
            
        }
        
    }
        
        this.moveflag=true;
    });

    }//draw終わり
}//Gameクラス終わり。
document.body.addEventListener("wheel",function(event){ 
    // event.preventDefault()
    scroll=event.deltaY; //スクロール下なら＋の値、上ならーの値。アイテムを変えるのに使えそう。
    console.log(scroll);
},false);
