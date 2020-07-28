import { parseHTML } from "jquery";
import Game from './game';
import { random } from "lodash";

const ViewWidth=13;
const ViewHeight=17;
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;


export default class EnemyMap {
    constructor(x,y){
        this.enemyMap=new Array(); // エネミーのワールド座標
        this.currentArea=new Array();// エネミーのローカル座標
        this.loader = new PIXI.Loader();
        this.enemyContainer = new PIXI.Container();
        this.enemyContainer.sortableChildren=true;
        // this.enemyAnime=[];
        this.enemyAnime;
        this.hp=4;
        this.enemysX=new Array();
        this.enemysY=new Array();
        this.animeDir;
        this.routeMap=new Array(); //　経路探索のマッピング
        this.loopRuttingFrag=true;
        this.dirX;
        this.dirY;
        this.x=x;
        this.y=y;
        this.localX;
        this.localY;
        this.exist=false;
        this.beforeDirX;
        this.beforeDirY;
        this.status;


    }
    setLoadTexture(){
        this.loader.add("enemy1",'/storage/enemy/[Animal]Chicken_001.png');
        this.loader.add("enemy2",'/storage/enemy/[Animal]Chicken_002.png');
        this.loader.add("enemy3",'/storage/enemy/[Animal]Chicken_003.png');
        this.loader.add("enemy7",'/storage/enemy/[Animal]Chicken_007.png');
        this.loader.add("enemy8",'/storage/enemy/[Animal]Chicken_008.png');
        this.loader.add("enemy9",'/storage/enemy/[Animal]Chicken_009.png');
        this.loader.add("enemy13",'/storage/enemy/[Animal]Chicken_013.png');
        this.loader.add("enemy14",'/storage/enemy/[Animal]Chicken_014.png');
        this.loader.add("enemy15",'/storage/enemy/[Animal]Chicken_015.png');
        this.loader.add("enemy19",'/storage/enemy/[Animal]Chicken_019.png');
        this.loader.add("enemy20",'/storage/enemy/[Animal]Chicken_020.png');
        this.loader.add("enemy21",'/storage/enemy/[Animal]Chicken_021.png');

    }
    deleteEnemy(mapAry,enemys){
        this.enemyMap = new Array(mapAry.length);//移動のための2マス文多めにとる
        for(let y = 0; y < mapAry.length; y++) {
            this.enemyMap[y] = new Array(mapAry[0].length).fill(0);
        }
        for(let i=0; i<enemys.length; i++){
            enemys[i].x=-1;
            enemys[i].y=-1;
            enemys[i].localX=-1;
            enemys[i].localY=-1;
        }
    }
    setEnemyMap(mapAry,enemys){
        // 2次元配列の初期化
        this.enemyMap = new Array(mapAry.length);//移動のための2マス文多めにとる
        for(let y = 0; y < mapAry.length; y++) {
            this.enemyMap[y] = new Array(mapAry[0].length).fill(0);
        }

        for(let i=0;i<8;i++){
            this.enemysX.push(Math.floor( Math.random() * mapAry.length));
            this.enemysY.push(Math.floor( Math.random() * mapAry[0].length));
        }


        for(let mi=0; mi<mapAry.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<mapAry[0].length; mj++){//y0,y1がいくつあるか  
                // for(let i=0;i<8;i++){
                //     if(mapAry[mi][mj] != "9" && mapAry[this.enemysX[i]][this.enemysY[i]] != "9"){
                //         this.enemyMap[this.enemysX[i]][this.enemysY[i]]="enemy1";
                //         enemys.push(new EnemyMap(mi,mj));
                        
                        

                //     }

                // } 
                if(mapAry[mi][mj]=="9"){
                    this.enemyMap[mi][mj]="9";
                }

                if(mapAry[mi][mj]=="p"){
                    this.enemyMap[mi][mj]="p";
                }
                
            
            
            }
        }
        //敵エネミーをランダムで追加
        for(let i=0;i<8;i++){
            if(mapAry[this.enemysX[i]][this.enemysY[i]] != "9" &&mapAry[this.enemysX[i]][this.enemysY[i]] != "p"){
                this.enemyMap[this.enemysX[i]][this.enemysY[i]]="enemy1";
                enemys.push(new EnemyMap(this.enemysX[i],this.enemysY[i]));
                
                

            }

        } 
    }// setEnemyMap終わり
    enemyAnimation2(direction,enemy,game){  
        game.app.stage.removeChild(enemy.enemyAnime);

            let enemyAnimeTextures = [];

            switch(direction){
                case "FRONT":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy1"]);// 下
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy2"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy3"]);
                    break;
                case "DOWN":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy19"]);// 上
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy20"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy21"]);
                    break;
                case "LEFT":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy13"]);// 右
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy14"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy15"]);

                    break;
                case "RIGHT":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy7"]);// 左
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy8"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy9"]);
                    break;
                case "UP":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy1"]);// 下
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy2"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy3"]);
                    break;
                default:
                    console.log("その他の値が入っています:"+direction);
                    break;
            }
            if(enemy.animeDir != direction){// 前と移動方向が異なるとき
                console.log("前と移動方向が異なるとき");
                enemy.animeDir = direction;
                // アニメーションのスプライトを再セット
                enemy.enemyAnime=(new PIXI.extras.AnimatedSprite(enemyAnimeTextures));

            }else{
                console.log("前と移動方向が同じとき");
                enemy.animeDir = direction;
            }
            enemy.enemyAnime=(new PIXI.extras.AnimatedSprite(enemyAnimeTextures));
            enemy.enemyAnime.play();
            enemy.enemyAnime.animationSpeed = 0.035;
            enemy.enemyAnime.zIndex = 15;
            enemy.enemyAnime.scale.x = 1.2; //何か幅が40pxの画像でテストしてるから。
            enemy.enemyAnime.scale.y = 1.5;
            enemy.enemyAnime.x = (enemy.localY * 48)-48;   //-48は左右に1マスずつ余分にとってるから,LEFTならoffsetは-48,
            enemy.enemyAnime.y = (enemy.localX * 48)-48;

            // enemy.beforeDirX = enemy.dirX;
            // enemy.beforeDirY = enemy.dirY;

            console.log("移動した鳥の座標x:"+enemy.localX);
            console.log("移動した鳥の座標y:"+enemy.localY);
            

            game.app.stage.addChild(enemy.enemyAnime);

            // this.dirMoveAnimetion(enemy.enemyAnime,offsetX,offsetY);

    }

    enemyAnimation(direction,enemy,game){  
        game.app.stage.removeChild(enemy.enemyAnime);

        // console.log("エネミーワールド座標@enemyAnimation:"+enemy.x+","+enemy.y);
        // console.log("エネミーローカル座標@enemyAnimation:"+enemy.localX+","+enemy.localY);

            let enemyAnimeTextures = [];
            switch(direction){
                case "FRONT":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy1"]);// 下
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy2"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy3"]);
                    break;
                case "DOWN":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy1"]);// 下
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy2"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy3"]);
                    this.enemyMap[enemy.x][enemy.y]=0;
                    this.enemyMap[enemy.x+1][enemy.y]="enemy1";
                    this.currentArea[enemy.localX][enemy.localY]=0;
                    this.currentArea[enemy.dirX][enemy.dirY]="enemy1";
                    enemy.x=enemy.x+1;
                    break;
                case "LEFT":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy7"]);// 左
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy8"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy9"]);
                    this.enemyMap[enemy.x][enemy.y]=0;
                    this.enemyMap[enemy.x][enemy.y-1]="enemy1";
                    this.currentArea[enemy.localX][enemy.localY]=0;
                    this.currentArea[enemy.dirX][enemy.dirY]="enemy1";
                    enemy.y=enemy.y-1;
                    break;
                case "RIGHT":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy13"]);// 右
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy14"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy15"]);
                    this.enemyMap[enemy.x][enemy.y]=0;
                    this.enemyMap[enemy.x][enemy.y+1]="enemy1";
                    this.currentArea[enemy.localX][enemy.localY]=0;
                    this.currentArea[enemy.dirX][enemy.dirY]="enemy1";
                    enemy.y=enemy.y+1;
                    break;
                case "UP":
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy19"]);// 上
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy20"]);
                    enemyAnimeTextures.push(PIXI.utils.TextureCache["enemy21"]);
                    this.enemyMap[enemy.x][enemy.y]=0;
                    this.enemyMap[enemy.x-1][enemy.y]="enemy1";
                    this.currentArea[enemy.localX][enemy.localY]=0;
                    this.currentArea[enemy.dirX][enemy.dirY]="enemy1";
                    enemy.x=enemy.x-1;
                    break;
                default:
                    console.log("その他の値が入っています:");
                    break;
            }
            if(enemy.animeDir != direction){// 前と移動方向が異なるとき
                console.log("前と移動方向が異なるとき");
                enemy.animeDir = direction;
                // アニメーションのスプライトを再セット
                enemy.enemyAnime=(new PIXI.extras.AnimatedSprite(enemyAnimeTextures));

            }else{
                console.log("前と移動方向が同じとき");
                enemy.animeDir = direction;
            }
            enemy.enemyAnime=(new PIXI.extras.AnimatedSprite(enemyAnimeTextures));
            enemy.enemyAnime.play();
            enemy.enemyAnime.animationSpeed = 0.035;
            enemy.enemyAnime.zIndex = 15;
            enemy.enemyAnime.scale.x = 1.2; //何か幅が40pxの画像でテストしてるから。
            enemy.enemyAnime.scale.y = 1.5;
            enemy.enemyAnime.x = (enemy.dirY * 48)-48;   //-48は左右に1マスずつ余分にとってるから,LEFTならoffsetは-48,
            enemy.enemyAnime.y = (enemy.dirX * 48)-48;

            enemy.beforeDirX = enemy.dirX;
            enemy.beforeDirY = enemy.dirY;

            // console.log("移動した鳥の座標x:"+enemy.dirX);
            // console.log("移動した鳥の座標y:"+enemy.dirY);
            

            game.app.stage.addChild(enemy.enemyAnime);

            // this.dirMoveAnimetion(enemy.enemyAnime,offsetX,offsetY);

    }

    // this.currentAreaのpの位置とenemyの位置で経路探索
    setRouteMap(currentArea,localX,localY){
        // this.currentArea.forEach(element => {
        //     console.log(element);
        // });

        let enemyX=[];
        let enemyY=[];
        let playerX;
        let playerY;

        // 2次元配列の初期化
        this.routeMap = new Array(ViewWidth);//移動のための2マス文多めにとる
        for(let x = 0; x < ViewWidth; x++) {
            this.routeMap[x] = new Array(ViewHeight).fill(0);
        }
        for(let mi=0; mi<currentArea.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<currentArea[0].length; mj++){//y0,y1がいくつあるか
                
                switch(currentArea[mi][mj]){
                    case "enemy1"://localX,localYは1個のエネミーのローカル座標が渡される
                        enemyX.push(localX);
                        enemyY.push(localY);
                        this.routeMap[localX][localY]="e";

                        break;
                    case "p":
                        playerX = mi;
                        playerY = mj;
                        this.routeMap[mi][mj]="p";
                        break;
                    case "9":
                        this.routeMap[mi][mj]="9";
                        break;
                }
            
            
            }
        }//for終わり
       
        //エネミーとプレイヤが隣接しているときはdirX,dirYは前のを返す
        // if(){
        
        // }

        
        let count=1;



        //currenetAreaにエネミーがいてプレイヤと位置が重なってないとき
        // console.log("localX:"+localX+",localY:"+localY+"playerX:"+playerX+",playerY:"+playerY);
        // if(enemyX.length>0 && localX != playerX && localY != playerY){

        
        if(enemyX.length>0){
            this.loopRuttingMap(enemyX[0],enemyY[0],count);// エネミーの座標を渡す。

        }
        

    }// setRouteMap終わり

    loopRuttingMap(pathX,pathY,count,player){

        let minX=pathX-1;
        let maxX=pathX+1;
        let minY=pathY-1;
        let maxY=pathY+1;

        let pathsX=new Array();
        let pathsY=new Array();

        // ここからルートマッピングを始める。ダイクストラ法を使う
        // 隣接するマスに対して０が入っているか、カウントが今より大きければ、隣接座標に移る。
        // 初期に移動可能なマスの配列を作り、移動先の配列からまた配列を作るかんじ。
        if(this.loopRuttingFrag){
            if(minY >= 0){//左
                if(this.routeMap[pathX][pathY-1] == 0 || count < this.routeMap[pathX][pathY-1]
                    ||this.routeMap[pathX][pathY-1] == "p" ){

                    if(this.routeMap[pathX][pathY-1] == "p" ){
                        // console.log("pが見つかった！");
                        this.loopRuttingFrag=false;
                    }else if(!(this.routeMap[pathX][pathY-1] == "9" )){
                        this.routeMap[pathX][pathY-1]=count; 
                        pathsX.push(pathX);
                        pathsY.push(pathY-1);
                    }
                }
            } 
            if(minX >=0){//上
                if(this.routeMap[pathX-1][pathY] == 0 || count < this.routeMap[pathX-1][pathY]
                    || this.routeMap[pathX-1][pathY] == "p"){

                    if(this.routeMap[pathX-1][pathY] == "p" ){
                        // console.log("pが見つかった！");
                        this.loopRuttingFrag=false;
                    }else if(!(this.routeMap[pathX-1][pathY] == "9" )){
                        pathsX.push(pathX-1);
                        pathsY.push(pathY);
                        this.routeMap[pathX-1][pathY]=count;
                    }
     
                }            
            }
            if(maxY <= 16){//右
                if(this.routeMap[pathX][pathY+1] == 0 || count < this.routeMap[pathX][pathY+1]
                    || this.routeMap[pathX][pathY+1] == "p" ){

                    if(this.routeMap[pathX][pathY+1] == "p" ){
                        // console.log("pが見つかった！");
                        this.loopRuttingFrag=false;
                    }else if(!(this.routeMap[pathX][pathY+1] == "9" )){
                        pathsX.push(pathX);
                        pathsY.push(pathY+1);
                      this.routeMap[pathX][pathY+1]=count;  
                    }
                    
                    
                }        
            }
            if(maxX <=12){//下 
                if(this.routeMap[pathX+1][pathY] == 0 || count < this.routeMap[pathX+1][pathY]
                    || this.routeMap[pathX+1][pathY] == "p"){

                    if(this.routeMap[pathX+1][pathY] == "p" ){
                        // console.log("pが見つかった！");
                        this.loopRuttingFrag=false;
                    }else if(!(this.routeMap[pathX+1][pathY] == "9" )){
                        pathsX.push(pathX+1);
                        pathsY.push(pathY);
                        this.routeMap[pathX+1][pathY]=count;
                    }
                    
                    
                }            
            }            
        }

        // テス
        // for(let i=0;i<pathsX.length;i++){
        //      console.log("移動先の座標たち:"+pathsX[i]+","+pathsY[i]);
        // }

        this.nextLoopRuttingMap(pathsX,pathsY,count+1);
    }

    nextLoopRuttingMap(nextPathsX,nextPathsY,count){

        let pathsX=new Array();
        let pathsY=new Array();

        for(let i=0;i<nextPathsX.length;i++){

            // console.log("移動先の座標たち:"+nextPathsX[i]+","+nextPathsY[i]);

            let minX=nextPathsX[i]-1;
            let maxX=nextPathsX[i]+1;
            let minY=nextPathsY[i]-1;
            let maxY=nextPathsY[i]+1;



            // ここからルートマッピングを始める。ダイクストラ法を使う
            // 隣接するマスに対して０が入っているか、カウントが今より大きければ、隣接座標に移る。
            // 初期に移動可能なマスの配列を作り、移動先の配列からまた配列を作るかんじ。
            if(this.loopRuttingFrag){
                if(minY >= 0){//左
                    if(this.routeMap[nextPathsX[i]][nextPathsY[i]-1] == 0 || count < this.routeMap[nextPathsX[i]][nextPathsY[i]-1]
                        ||this.routeMap[nextPathsX[i]][nextPathsY[i]-1] == "p" ){

                        if(this.routeMap[nextPathsX[i]][nextPathsY[i]-1] == "p" ){
                            // console.log("pが見つかった！");
                            this.loopRuttingFrag=false;
                        }else if(!(this.routeMap[nextPathsX[i]][nextPathsY[i]-1] == "9" )){
                            this.routeMap[nextPathsX[i]][nextPathsY[i]-1]=count; 
                            pathsX.push(nextPathsX[i]);
                            pathsY.push(nextPathsY[i]-1);
                        }
                    }
                } 
                if(minX >=0){//上
                    if(this.routeMap[nextPathsX[i]-1][nextPathsY[i]] == 0 || count < this.routeMap[nextPathsX[i]-1][nextPathsY[i]]
                        || this.routeMap[nextPathsX[i]-1][nextPathsY[i]] == "p"){

                        if(this.routeMap[nextPathsX[i]-1][nextPathsY[i]] == "p" ){
                            // console.log("pが見つかった！");
                            this.loopRuttingFrag=false;
                        }else if(!(this.routeMap[nextPathsX[i]-1][nextPathsY[i]] == "9" )){
                            pathsX.push(nextPathsX[i]-1);
                            pathsY.push(nextPathsY[i]);
                            this.routeMap[nextPathsX[i]-1][nextPathsY[i]]=count;
                        }
        
                    }            
                }
                if(maxY <= 16){//右
                    if(this.routeMap[nextPathsX[i]][nextPathsY[i]+1] == 0 || count < this.routeMap[nextPathsX[i]][nextPathsY[i]+1]
                        || this.routeMap[nextPathsX[i]][nextPathsY[i]+1] == "p" ){

                        if(this.routeMap[nextPathsX[i]][nextPathsY[i]+1] == "p" ){
                            // console.log("pが見つかった！");
                            this.loopRuttingFrag=false;
                        }else if(!(this.routeMap[nextPathsX[i]][nextPathsY[i]+1] == "9" )){
                            pathsX.push(nextPathsX[i]);
                            pathsY.push(nextPathsY[i]+1);
                        this.routeMap[nextPathsX[i]][nextPathsY[i]+1]=count;  
                        }
                        
                        
                    }        
                }
                if(maxX <=12){//下 
                    if(this.routeMap[nextPathsX[i]+1][nextPathsY[i]] == 0 || count < this.routeMap[nextPathsX[i]+1][nextPathsY[i]]
                        || this.routeMap[nextPathsX[i]+1][nextPathsY[i]] == "p"){

                        if(this.routeMap[nextPathsX[i]+1][nextPathsY[i]] == "p" ){
                            // console.log("pが見つかった！");
                            this.loopRuttingFrag=false;
                        }else if(!(this.routeMap[nextPathsX[i]+1][nextPathsY[i]] == "9" )){
                            pathsX.push(nextPathsX[i]+1);
                            pathsY.push(nextPathsY[i]);
                            this.routeMap[nextPathsX[i]+1][nextPathsY[i]]=count;
                        }
                        
                        
                    }            
                }            
            }else{
                let confirmRouteX=new Array();
                let confirmRouteY=new Array();

                
                let c=count-1;
                // console.log("現在のカウントは？"+c);
                this.saveRoute(c,6,8,confirmRouteX,confirmRouteY);

                // console.log("確定経路,経路数"+confirmRouteX.length);
                // for(let i=0;i<confirmRouteX.length;i++){
                    // console.log(i+"番目:"+confirmRouteX[i]+","+confirmRouteY[i]);
                // }
                // console.log("最初に移動すべき座標は？"+confirmRouteX.pop()+","+confirmRouteY.pop());
                this.dirX=confirmRouteX.pop();
                this.dirY=confirmRouteY.pop();


            
            }//if 終わり
        }// for 終わり

        let c=count+1;
        if(this.loopRuttingFrag){
            this.nextLoopRuttingMap(pathsX,pathsY,c);
        }

    }// nextLoopRuttingMap終わり


    saveRoute(count,i,j,ConfirmRouteX,ConfirmRouteY){// i,jはrouteMapのプレイヤの固定座標
        // SaveRoute()の考え方。
        // pの位置までの最短経路が見つかったので、pの縦横のcountの値が入っている座標を調べる。その座標を保存する。
        // その座標に移動し、縦横にcount-1が入っている座標を調べる。
        // 縦横にeが見つかるまで繰り返し、一連の事を配列に格納する。
                let minX=i-1;
                let maxX=i+1;
                let minY=j-1;
                let maxY=j+1;

            grid_loop:

            if(count>0){
                if(minY >= 0){//左
                    if(this.routeMap[i][j-1] == count ){
                        this.routeMap[i][j-1]=count; 
                        ConfirmRouteX.push(i);
                        ConfirmRouteY.push(j-1);
                        this.saveRoute(count-1,i,j-1,ConfirmRouteX,ConfirmRouteY);
                        break grid_loop;
                    }
                } 
                if(minX >=0){//上
                    if( this.routeMap[i-1][j] == count){
                        ConfirmRouteX.push(i-1);
                        ConfirmRouteY.push(j);
                        this.routeMap[i-1][j]=count;
                        this.saveRoute(count-1,i-1,j,ConfirmRouteX,ConfirmRouteY);
                        break grid_loop;
                    }            
                }
                if(maxY <= 16){//右
                    if( this.routeMap[i][j+1] == count ){

                        ConfirmRouteX.push(i);
                        ConfirmRouteY.push(j+1);
                        this.routeMap[i][j+1]=count;
                        this.saveRoute(count-1,i,j+1,ConfirmRouteX,ConfirmRouteY);
                        break grid_loop;
  
                    }        
                }
                if(maxX <=12){//下 
                    if(this.routeMap[i+1][j] == count){
                        ConfirmRouteX.push(i+1);
                        ConfirmRouteY.push(j);
                        this.routeMap[i+1][j]=count;
                        this.saveRoute(count-1,i+1,j,ConfirmRouteX,ConfirmRouteY);
                        break grid_loop;
                    }            
                }        
            }
        
        
        return;
    }
    AI2(enemys,player,game,direction,textArea){
        // AI2の考え方
        // →プレイヤの攻撃→敵に隣接していなければ敵の移動
        // →プレイヤの攻撃→プレイヤに敵が隣接している→プレイヤの攻撃→敵の攻撃

        game.app.stage.removeChild(this.enemyContainer);
        this.enemyContainer.removeChildren();

        for(let i=0; i<enemys.length; i++){
            if(enemys[i].exist==true){

                console.log("AIの開始"+i+"回目");

                enemys[i].routeMap=new Array();
                enemys[i].loopRuttingFrag=true;
                enemys[i].setRouteMap(this.currentArea,enemys[i].localX,enemys[i].localY);//最短経路を設定する。

                console.log("最初に移動すべき座標は？"+enemys[i].dirX+","+enemys[i].dirY);  

    
                if(enemys[i].dirX && enemys[i].dirY //最短経路が求められているとき
                    && this.whatEnemyCollision(enemys[i],player) == true){// エネミーの最短経路に障害物がないとき 
                        console.log("enemyは"+enemys[i].dirX+","+enemys[i].dirY+"へ移動します");
                        //エネミーの進行方向を求める。
                        let DirectionTravel=this.whatDirectionTravel(enemys[i]);
                        console.log("敵"+i+"は"+DirectionTravel); 
                        //エネミーの進行方向に進ませ、エネミーのワールドマップ座標を更新する。
                        if(DirectionTravel){
                            this.enemyAnimation(DirectionTravel,enemys[i],game);
                        
                        }
                }else {
                    console.log("エネミーが動かないとき");

                    // エネミーが動かないときはエネミーのワールド座標を更新しない。
                    this.enemyAnimation2(enemys[i].animeDir,enemys[i],game);

                    // this.createEnemyTexture(this.currentArea,0,0,game,enemys);
                    //　敵に隣接していれば敵の攻撃
                    if(this.whatAdjacent(enemys[i],player)){
                        let dir=this.whatAttackDirection(enemys[i],player);
                        this.enemyAnimation2(dir,enemys[i],game);
                        this.attack(enemys[i],player,game,textArea);
                    }

                }

                

            }
        }
        textArea.hp(player,game);
    }

    AI(enemys,player,game,direction,textArea){
        // AIの考え方。
        // プレイヤの移動→障害物がなければ敵の移動→障害物があれば敵は移動しない→移動後に敵に隣接していれば敵の攻撃
        for(let i=0; i<enemys.length; i++){
            if(enemys[i].exist==true){

                console.log("AIの開始"+i+"回目");

                enemys[i].routeMap=new Array();
                enemys[i].loopRuttingFrag=true;
                enemys[i].setRouteMap(this.currentArea,enemys[i].localX,enemys[i].localY);//最短経路を設定する。

                console.log("最初に移動すべき座標は？"+enemys[i].dirX+","+enemys[i].dirY);  


    
                if(enemys[i].dirX && enemys[i].dirY //最短経路が求められているとき
                    && this.whatEnemyCollision(enemys[i],player) == true){// エネミーの移動先に障害物がないとき 
                        console.log("enemyは"+enemys[i].dirX+","+enemys[i].dirY+"へ移動します");
                        //エネミーの進行方向を求める。
                        let DirectionTravel=this.whatDirectionTravel(enemys[i]);
                        console.log("敵"+i+"は"+DirectionTravel); 
                        //エネミーの進行方向に進ませ、エネミーのワールドマップ座標を更新する。
                        if(DirectionTravel){
                            this.enemyAnimation(DirectionTravel,enemys[i],game);
                        
                        }
                }else {
                    // エネミーが動かないときはエネミーのワールド座標を更新しない。
                    // エネミーの座標はプレイヤの移動方向に応じて変更する。
                    console.log("エネミーが動かないとき");
                    console.log(direction);
                    switch(direction){
                        case LEFT:
                            enemys[i].dirX=enemys[i].beforeDirX;
                            enemys[i].dirY=enemys[i].beforeDirY+1;//プレイヤが左移動の時
                            break;
                        case UP:
                            enemys[i].dirX=enemys[i].beforeDirX+1;
                            enemys[i].dirY=enemys[i].beforeDirY;//プレイヤが左移動の時
                            break;
                        case RIGHT:
                            enemys[i].dirX=enemys[i].beforeDirX;
                            enemys[i].dirY=enemys[i].beforeDirY-1;//プレイヤが左移動の時
                            break;
                        case DOWN:
                            enemys[i].dirX=enemys[i].beforeDirX-1;
                            enemys[i].dirY=enemys[i].beforeDirY;//プレイヤが左移動の時
                            break;
                    }
                    // 障害物があり移動しない時は何もしない。
                    this.enemyAnimation("FRONT",enemys[i],game);
                    
                    //　敵に隣接していれば敵の攻撃
                    if(this.whatAdjacent(enemys[i],player)){
                        this.attack(enemys[i],player,game,textArea);
                    }

                }

                

            }
        }
        textArea.hp(player,game);
        // const endTime = performance.now(); // 終了時間
        // console.log(endTime - startTime); // 何ミリ秒かかったかを表示する
        console.log("AIの終了");
    }


    whatAdjacent(enemy,player){
        if(enemy.localX==player.localX && enemy.localY == player.localY-1){//エネミーはプレイヤの左にいる
            return true;
        }
        if(enemy.localX==player.localX-1 && enemy.localY == player.localY){//上
            return true;
        }
        if(enemy.localX==player.localX && enemy.localY == player.localY+1){//右
            return true;
        }
        if(enemy.localX==player.localX+1 && enemy.localY == player.localY){//下
            return true;
        }
        return false;
    }


    whatAttackDirection(enemy,player){
        if(enemy.localX==player.localX && enemy.localY == player.localY-1){//エネミーはプレイヤの左にいる
            return "LEFT";
        }
        if(enemy.localX==player.localX-1 && enemy.localY == player.localY){//上
            return "UP";
        }
        if(enemy.localX==player.localX && enemy.localY == player.localY+1){//右
            return "RIGHT";
        }
        if(enemy.localX==player.localX+1 && enemy.localY == player.localY){//下
            return "DOWN";
        }
        return false;
    }


    attack(enemy,player,game){
        console.log("敵の攻撃");
        player.hp-=2;
        let direction = enemy.whatAttackDirection(enemy,player);
        let beforeOffsetX = 0;
        let beforeOffsetY = 0;
        let afterOffsetX = 0;
        let afterOffsetY = 0;

        switch(direction){
            case "LEFT":
                beforeOffsetX = -48;
                afterOffsetX =48;
                break;
            case "UP":
                beforeOffsetY = -48;
                afterOffsetY =48;
                break;
            case "RIGHT":
                beforeOffsetX = 48;
                afterOffsetX = -48;
                break;
            case "DOWN":
                beforeOffsetY = 48;
                afterOffsetY = -48;
                break;
            default:
                console.log("その他の値が入っている"+direction);
                break;
    }
        game.toriSound.play();
        setTimeout(() => {
            this.dirMoveAnimetion(enemy.enemyAnime,beforeOffsetX,beforeOffsetY);
            this.attackEffect(game);
            setTimeout(() => {
                this.dirMoveAnimetion(enemy.enemyAnime,afterOffsetX,afterOffsetY);
            }, 100);   
        }, 25);


    }

    attackEffect(game){
        for(let i=0;i<6;i++){
            let ellipse = new PIXI.Graphics()       // メソッドチェーンで描画するので、;(セミコロン)を付けない   
            .beginFill(0xff0000)                    // endFill()までの描画に対する塗りつぶし色指定
            .drawEllipse(game.app.screen.width/2,game.app.screen.height/2,4,4)// (中心のx座標, 中心のy座標, 幅, 高さ)
            .endFill();                             // ここまでに描いた図形を塗りつぶす
            
            let r = 15;  // 半径
            let a = 60.0*i;  // 角度（度）
            let x = r * Math.cos(a / 180 * Math.PI);  // X座標
            let y = r * Math.sin(a / 180 * Math.PI);  // Y座標

            ellipse.x = x;
            ellipse.y = y;

           
                
            ellipse.zIndex=30;
            ellipse.alpha=0.4;
            game.app.stage.addChild(ellipse);

            TweenMax.to(ellipse, 0.200, 
                {   
                    pixi: { 
                        x: ellipse.x +x*1.5, 
                        y: ellipse.y +y*1.5, 
                        angle: 2*Math.random(),

                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );


            setTimeout(() => {
                ellipse.alpha=0;
            }, 200);  
        }

    }

    //エネミーの移動先に障害物はないかどうか
    whatEnemyCollision(enemy,player){
        console.log("this.currentArea[enemy.dirX][enemy.dirY]は？"+this.currentArea[enemy.dirX][enemy.dirY]);
        if(!(enemy.dirX == player.localX && enemy.dirY == player.localY)){//プレイヤ
            if(!(this.currentArea[enemy.dirX][enemy.dirY] == "9")){//壁
                if(!(this.currentArea[enemy.dirX][enemy.dirY]== "enemy1")){//エネミー
                        return true;
                }
                }
        }
        return false;

    }


    whatDirectionTravel(enemy){
        if(enemy.dirY<enemy.localY){//左に進む
            return "LEFT";
        }
        if(enemy.dirX<enemy.localX){//上に進む
            return "UP";
        }
        if(enemy.dirY>enemy.localY){//右に進む
            return "RIGHT";
        }
        if(enemy.dirX>enemy.localX){//下に進む
            return "DOWN";
        }

        return false;
    }

    createEnemyTexture(enemyCurrentArea,offsetX,offsetY,game,enemys){// drawから呼ばれる
        game.app.stage.removeChild(this.enemyContainer);
        this.enemyContainer.removeChildren();
        let i=0;
        for(let mi=0; mi<enemyCurrentArea.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<enemyCurrentArea[0].length; mj++){//y0,y1がいくつあるか
                switch(enemyCurrentArea[mi][mj]){
                    case "enemy1":
                        // console.log("enemysの数は？@drawから呼ばれた:"+enemys.length);
                        enemys[i].enemyAnime.x = (mj * 48)-48+offsetX;   //-48は左右に1マスずつ余分にとってるから,LEFTならoffsetは-48,
                        enemys[i].enemyAnime.y = (mi * 48)-48+offsetY;
                        this.enemyContainer.zIndex=10;
                        this.enemyContainer.addChild(enemys[i].enemyAnime);             
                        game.app.stage.addChild(this.enemyContainer);    
                        enemys[i].dirMoveAnimetion(enemys[i].enemyAnime,offsetX,offsetY);     
                        i++;              
                        break;
                }
            
            
            }
        }
        
    }// createEnemyTexture終わり

    dirMoveAnimetion(enemyAnime,offsetX,offsetY){
        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(enemyAnime, 0.100, 
                {   
                    pixi: { 
                        x: enemyAnime.x  -30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(enemyAnime, 0.100, 
                {   
                    pixi: { 
                        x: enemyAnime.x + 30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );             
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(enemyAnime, 0.100, 
                {   
                    pixi: { 
                        y: enemyAnime.y  -30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }   else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(enemyAnime, 0.100, 
                {   
                    pixi: { 
                        y: enemyAnime.y +30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }         
    }// dirMoveAnimetion終わり


}


