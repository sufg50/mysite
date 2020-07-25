import GeneralMap from './generalMap';
import EnemyMap from './enemyMap';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const ENTER = 13;
const ESC=27;
const Z=90;

export default class SceneManeger{
    constructor(){

    }
    sceneDungeon1(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy){
        this.fadeOut(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy);
    }
    sceneTown(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy){
        this.fadeOut(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy);
    }

    fadeOut(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy){
        sprite.alpha = sprite.alpha - 0.1;
        container.alpha=container.alpha-0.1;
        if (sprite.alpha <= 0) {
          sprite.visible = false;
          container.visible = false;
          if(game.sceneDungeon1){
              this.LoadDungeon(player,item,background,game,viewArea,textArea,enemys,enemy);// ここでcontainer,spriteを渡しても初期描画で上書きされるかもしれない
          }
          if(game.sceneTown){
            this.LoadTown(player,item,background,game,viewArea,textArea,enemys,enemy);// ここでcontainer,spriteを渡しても初期描画で上書きされるかもしれない
        }
          
          return;
        }
        setTimeout(() => {
          this.fadeOut(container,sprite,player,item,background,game,viewArea,textArea,enemys,enemy);
        }, 100);
      };// fadeOut終わり

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


      LoadTown(player,item,background,game,viewArea,textArea,enemys,enemy){
        // オブジェクトを初期化したかったけれど、なぜかできなかった。そのためこの関数では
        // オブジェクトのプロパティを初期化している。

        // ステージをリセットする。
        game.app.stage.removeChildren();
        game.gameScene1.removeChildren();

        // 新しいマップの読み込み。
        var promise=[];
        let generalMap =new GeneralMap();
        game.dungeonLevel++;
        promise = generalMap.getCSV(0);

        // 雨量の読み込み
        var promise2=[];
        let generalMap2 =new GeneralMap();
        promise2 = generalMap2.getRainFallCSV(game);

        // 初期化とか
        player.mvCharacterAnime[0].animationSpeed = 0.035;
        game.dungeonMoveFlag=false; // 初期表示時は階段の上にいないのでfalseにしておく。
        game.sceneDungeon1=false;

        // 固定描画を消去
        textArea.delete(game);
      
        promise.then((value) => {
          promise2.then((value2) => {

            console.log("雨量");            
            let c=1;

            game.rainfalls=value2;
            for (let key in game.rainfalls) {
                console.log('key:' + key + ' value:' + game.rainfalls[key]+"回数"+c++);
            }    

            //新しいマップからローカル背景エリアを設定。
            background.currentArea=viewArea.getFirstPlayerArea(value,player,"p");
            game.mapArea=(value); 

            
            //今のマップにいるエネミーをすべて削除
            enemy.deleteEnemy(value,enemys);

            //アイテムを全て削除
            item.setItemMap(game.mapArea);
            item.deleteItem();

            // 初期画面を表示、drawの代わり。
            game.playerCollision(DOWN,player,item,background,game,viewArea,enemy,enemys,textArea);

            // フェードイン
            player.mvCharacterAnime[0].alpha=0;// フェードインが始まる前にプレイヤを見えなくしておく。
            this.fadeIn(player.mvCharacterAnime[0],game.gameScene1,player); // フェードイン終了後に入力を受け付けるようにしてある。



        }, (error) => {
            console.error("error:", error.message);
        });
          }, (error) => {
            console.error("error:", error.message);
        });

    }//LoadTown終わり


      LoadDungeon(player,item,background,game,viewArea,textArea,enemys,enemy){
        
        // ステージをリセットする。
        game.app.stage.removeChildren();
        game.gameScene1.removeChildren();

        // 新しいマップの読み込み。
        var promise=[];
        let generalMap =new GeneralMap();
        game.dungeonLevel++;
        promise = generalMap.getCSV(game.dungeonLevel);

        // 初期化とか
        player.hp=20;
        player.mvCharacterAnime[0].animationSpeed = 0.035;
        game.dungeonMoveFlag=false; // 初期表示時は階段の上にいないのでfalseにしておく。
       
        

        promise.then((value) => {
            
            //新しいマップからローカル背景エリアを設定。
            background.currentArea=viewArea.getFirstPlayerArea(value,player,"p");
            game.mapArea=(value); 

            //アイテムの再配置。
            item.setItemMap(game.mapArea); 
            item.currentArea=viewArea.getFirstPlayerArea(item.itemMap,player,"p");// //コピーした配列の中にはpが入っているのでそこを中心としたitemCurrenetAreaを設定する。
            
            // エネミーの再配置
            enemy.setEnemyMap(value,enemys);//エネミーにワールド座標を設定する。
            enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);// ローカル座標も設定する
            for(let i=0;i<enemys.length;i++){
                enemy.enemyAnimation("FRONT",enemys[i],game);
            }

            // 初期画面を表示、drawの代わり。
            game.playerCollision(DOWN,player,item,background,game,viewArea,enemy,enemys,textArea);

            // フェードイン
            player.mvCharacterAnime[0].alpha=0;// フェードインが始まる前にプレイヤを見えなくしておく。
            this.fadeIn(player.mvCharacterAnime[0],game.gameScene1,player); // フェードイン終了後に入力を受け付けるようにしてある。

            
        }, (error) => {
            console.error("error:", error.message);
        });
    }

}