export default class Player{

    constructor( x, y,dx,dy ) {
        this.x = x;//map上でのプレイヤの座標
        this.y = y;
        this.dir_x=dx;//map上でのプレイヤの方向座標
        this.dir_y=dy;
        this.items=new Array();
        this.localX=6;
        this.localY=8;
        this.status;//moveとattackのどちらか
        this.maxHp=20;
        this.hp=20;
        this.money;
        this.animeDir;
        this.mvCharacterAnime = [];
        this.loader = new PIXI.Loader(); 

    }

    setLoadTexture(){
        this.loader.add('we1', '/storage/mapchip/weed1.png')
        this.loader.add('pico0_1','/storage/character/player/pico1.png');//正面また下
        this.loader.add('pico0_2','/storage/character/player/pico2.png');
        this.loader.add('pico0_3','/storage/character/player/pico3.png');
        this.loader.add('pico1_1','/storage/character/player/pico4.png');//左
        this.loader.add('pico1_2','/storage/character/player/pico5.png');
        this.loader.add('pico1_3','/storage/character/player/pico6.png');
        this.loader.add('pico2_1','/storage/character/player/pico7.png');//上
        this.loader.add('pico2_2','/storage/character/player/pico8.png');
        this.loader.add('pico2_3','/storage/character/player/pico9.png');
        this.loader.add('pico3_1','/storage/character/player/pico10.png');//右
        this.loader.add('pico3_2','/storage/character/player/pico11.png');
        this.loader.add('pico3_3','/storage/character/player/pico12.png');
    }


    attack(game,animeDir,playerAnime,enemy,enemys){

        let beforeOffsetX = 0;
        let beforeOffsetY = 0;
        let afterOffsetX = 0;
        let afterOffsetY = 0;

        switch(animeDir){
            case "LEFT":
                beforeOffsetX = 48;
                afterOffsetX =-48;
                break;
            case "UP":
                beforeOffsetY = 48;
                afterOffsetY =-48;
                break;
            case "RIGHT":
                beforeOffsetX = -48;
                afterOffsetX = 48;
                break;
            case "DOWN":
            case "FRONT":
                beforeOffsetY = -48;
                afterOffsetY = 48;
                break;
        }
        game.toriSound.play();
        // game.playerAttackSound.play();

        setTimeout(() => {
            this.dirMoveAnimetion(playerAnime,beforeOffsetX,beforeOffsetY);
            this.enemyDamage(game,animeDir,playerAnime,enemy,enemys);
            setTimeout(() => {
                this.dirMoveAnimetion(playerAnime,afterOffsetX,afterOffsetY);
            }, 100);   
        }, 25);

    }// attack終わり

//　プレイヤ攻撃先(向いている方向)にエネミーがいた場合ＨＰを減らす→０以下だった場合は消す。
enemyDamage(game,animeDir,playerAnime,enemy,enemys){
    for(let i=0; i<enemys.length; i++){
        if(enemys[i].exist==true){
            if(animeDir==this.AttackDirectionDamageProcessing(enemys[i])){
                enemys[i].hp-=2;
            };
            if(enemys[i].hp<=0){
                //　ローカル座標とワールド座標からも消す。
                console.log("消去対象の値は？"+ enemy.enemyMap[enemys[i].x][enemys[i].y]);
                console.log("消去対象の値は？"+ enemy.currentArea[enemys[i].localX][enemys[i].localY]);
                enemy.enemyMap[enemys[i].x][enemys[i].y]=0;
                enemy.currentArea[enemys[i].localX][enemys[i].localY]=0;
                
                // ステージからも消す。
                game.app.stage.removeChild(enemys[i].enemyAnime);

                //オブジェクトの破棄をしようと思ったけど、倒したエネミーを表示領域に入れないようにしておく。
                enemys[i].x=-1;
                enemys[i].y=-1;
                enemys[i].localX=-1;
                enemys[i].localY=-1;
               
            }
        }
    }



}

AttackDirectionDamageProcessing(enemy){
    if(enemy.localX==this.localX && enemy.localY == this.localY-1){//エネミーはプレイヤの左にいる
        return "LEFT";
    }
    if(enemy.localX==this.localX-1 && enemy.localY == this.localY){//上
        return "UP";
       
    }
    if(enemy.localX==this.localX && enemy.localY == this.localY+1){//右
        return "RIGHT";
        
    }
    if(enemy.localX==this.localX+1 && enemy.localY == this.localY){//下
        return "DOWN";
        
    }
    return false;
}

dirMoveAnimetion(playerAnime,offsetX,offsetY){
        if(offsetX == 48 && offsetY == 0){
            TweenMax.to(playerAnime, 0.100, 
                {   
                    pixi: { 
                        x: playerAnime.x  -30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == -48 && offsetY == 0){
            TweenMax.to(playerAnime, 0.100, 
                {   
                    pixi: { 
                        x: playerAnime.x + 30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );             
        }else if(offsetX == 0 && offsetY == 48 ){
            TweenMax.to(playerAnime, 0.100, 
                {   
                    pixi: { 
                        y: playerAnime.y  -30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }else if(offsetX == 0 && offsetY == -48){
            TweenMax.to(playerAnime, 0.100, 
                {   
                    pixi: { 
                        y: playerAnime.y +30, 
                    },
                    ease: Power0.easeNone, 
                    repeat: 0
                }
            );            
        }         
    }// dirMoveAnimetion終わり

    walkAnimetion(direction,i=6,j=8,game){
        game.app.stage.removeChild(this.mvCharacterAnime[0]);
        
        let ttCharacter = [];

        switch(direction){
            case "DOWN":
            case "FRONT":
                ttCharacter.push(PIXI.utils.TextureCache["pico0_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico0_2"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico0_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico0_3"]);
                break;
            case "LEFT":
                ttCharacter.push(PIXI.utils.TextureCache["pico1_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico1_2"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico1_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico1_3"]);
                break;
            case "UP":
                ttCharacter.push(PIXI.utils.TextureCache["pico2_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico2_2"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico2_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico2_3"]);
                break;
            case "RIGHT":
                ttCharacter.push(PIXI.utils.TextureCache["pico3_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico3_2"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico3_1"]);
                ttCharacter.push(PIXI.utils.TextureCache["pico3_3"]);
                break;
            default:
                console.log("その他の値が入っています:");
                break;
        }
        // 参考　https://ryo620.org/2016/12/pixijs-game-01/
        
        if(this.animeDir != direction){// 前と移動方向が異なるとき
            console.log("前と移動方向が異なるとき");
             this.animeDir = direction;
             this.mvCharacterAnime=[];// アニメーションを再セット

             //　テクスチャの配列をオブジェクトに入れる。
             this.mvCharacterAnime.push(new PIXI.extras.AnimatedSprite(ttCharacter));
        }else{
            console.log("前と移動方向が同じとき");
            this.animeDir = direction;
        }

        this.mvCharacterAnime[0].play();  // アニメーションスタート
        this.mvCharacterAnime[0].animationSpeed = 0.07; // アニメーション速度
        this.mvCharacterAnime[0].zIndex = 15;
        this.mvCharacterAnime[0].scale.x = this.mvCharacterAnime[0].scale.y = 1.5; //　元々の画像が32pxのばかり使ってるのため、48pxは想定外
        this.mvCharacterAnime[0].x = (j * 48)-48;
        this.mvCharacterAnime[0].y = (i * 48)-48;
        game.app.stage.addChild(this.mvCharacterAnime[0]);
        //　コンテナにキャラを入れるとzIndexが動かないのでとりあえずいれない
        // this.gameScene1.addChild(this.mvCharacterAnime[0]); //コンテナにスプライトを入れる
        // this.app.stage.addChild(this.gameScene1);    
    }

    set (x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setDirTip(dx,dy){
        this.dir_x=dx;
        this.dir_y=dy;
    }
    getDirX(){
        return this.dir_x;
    }
    getDirY(){
        return this.dir_y;
        
    }

}