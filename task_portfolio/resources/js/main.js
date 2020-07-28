import Game from './game';
import Player from './Player';
import ItemMap from './itemmap';
import BackGroundMap from './backgroundMap';
import GeneralMap from './generalMap';
import ViewArea from './viewArea';
import EnemyMap from './enemyMap';
import TextArea from './textArea';

//promise 参考　https://qiita.com/ysk_1031/items/888a84cb259cec4e0625

// 新しいマップの読み込み。
let game = new Game();
let generalMap =new GeneralMap(); 
var promise=[];
promise = generalMap.getCSV(game.dungeonLevel);//引数がファイル名の一部になってるけど、""でくくってもそうじゃなくても渡せる。エラーになるかも
game.app.stage.sortableChildren = true;

let player= new Player();
let item=new ItemMap();
let background = new BackGroundMap();
let viewArea = new ViewArea();
let enemy = new EnemyMap();
let enemys=new Array();
let textArea=new TextArea();


player.money=0;// ここはＤＢから情報を持ってきて入れる予定

//画像の読み込み
enemy.setLoadTexture();
item.setLoadTexture();
player.setLoadTexture();
background.setLoadTexture();

promise.then((value) => {// csvからマップのＤＬの非同期処理が終わるのを待つ
    background.currentArea=viewArea.getFirstPlayerArea(value,player,"p"); // promise成功時のreturnの値を代入
    game.mapArea=(value);// game.mapAreaはgeneralMap

    player.loader.load(() => {// 画像の読み込みを待つ
        item.loader.load(()=>{// 画像の読み込みを待つ
            enemy.loader.load(()=>{// 画像の読み込みを待つ
                background.loader.load(()=>{// 画像の読み込みを待つ


        // 全体マップをアイテムマップにコピーしてitemを設置する
        // コピーした配列の中にはpが入っているのでそこを中心としたitemCurrenetAreaを設定する。
        item.setItemMap(value); 
        item.currentArea=viewArea.getFirstPlayerArea(item.itemMap,player,"p");

        // エネミーの設定
        enemy.setEnemyMap(value,enemys);//エネミーにワールド座標を設定する。
        enemy.currentArea=viewArea.getPlayer_Enemys_Area(enemy.enemyMap,player,enemys);// ローカル座標も設定する
        for(let i=0;i<enemys.length;i++){//エネミーの初期アニメーションの作成と方向を決定
            enemy.enemyAnimation("FRONT",enemys[i],game);
        }

        game.draw(game,player,item,background,viewArea,enemy,enemys,textArea);

                });//画像読み込み終わり
            });//画像読み込み終わり
        });//画像読み込み終わり
    });//画像読み込み終わり


}, (error) => {
    console.error("error:", error.message);
});