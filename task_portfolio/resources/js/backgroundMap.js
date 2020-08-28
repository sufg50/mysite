const ViewWidth=13;
const ViewHeight=17;

export default class BackGroundMap{
    constructor() {
        this.currentArea = new Array(ViewWidth);
        this.loader = new PIXI.Loader();
        };
    
    setLoadTexture(){
        this.loader.add("money",'/storage/mapitem/money.png')
        this.loader.add("wa1Texture",'/storage/mapchip/wall_1.png');
        this.loader.add("we1Texture",'/storage/mapchip/weed1.png');
        this.loader.add("um1Texture",'/storage/mapchip/umi.png'); 
        this.loader.add("kudariTexture",'/storage/mapchip/kudari_kaidan.png');
        this.loader.add("noboriTexture",'/storage/mapchip/noborikaidan.png');

        

    }
    createTexture_from_currentArea(offsetX,offsetY,game,player,textArea){
        //stageのchildが入ったままなのでリセットする。
        game.app.stage.removeChildren();
        //フェードアウトするときコンテナに入りまくってるからリセットしておく
        game.gameScene1.removeChildren();
        game.weatherContainer.removeChildren();
        game.rainContainer.removeChildren();

        //前回移動時のtweenアニメーションを停止後、tweenオブジェクトが格納された変数も消去する。    
        game.tweens.forEach(tween => {
            tween.kill();
        });
        game.tweens=[];

        if(game.sceneDungeon1){
            // 本当はコンテナごとにリセットしなければいけないが、今からは大変なため固定描画だけ再セットのようにしておく。
            textArea.gold(player,game);
            textArea.hp(player,game);            
        }
        if(game.sceneTown){
            textArea.weatherDate(game);
        }


        for(let i=0; i<this.currentArea.length; i++){
            for(let j=0; j<this.currentArea[0].length; j++){//PIXI.utils.TextureCache["we1"]
    
                switch(this.currentArea[i][j]){
                    case "9":// 壁 wall_1.png
                        game.createMapchipSprite(PIXI.utils.TextureCache["wa1Texture"],i,j,offsetX,offsetY,1);
                        break;
                    case "0":// 地面　weed1.png
                        game.createMapchipSprite(PIXI.utils.TextureCache["we1Texture"],i,j,offsetX,offsetY,1);
                        break;
                    case "1":// 海　umi.png
                        game.createMapchipSprite(PIXI.utils.TextureCache["um1Texture"],i,j,offsetX,offsetY,1);
                        break;
                    case "2":// 下り階段
                    case "4":// 下り階段
                        game.createMapchipSprite(PIXI.utils.TextureCache["kudariTexture"],i,j,offsetX,offsetY,1);
                        break;
                    case "3":// 下り階段
                        game.createMapchipSprite(PIXI.utils.TextureCache["noboriTexture"],i,j,offsetX,offsetY,1);
                        break;
                    case "p":// player。暫定的に草マップにプレイヤを初期表示しておく。
                        //プレイヤは常に画面の中心じゃないといけないから、背景スクロールのアニメーションと別
                        game.createMapchipSprite(PIXI.utils.TextureCache["we1Texture"],i,j,offsetX,offsetY,1);//ここは本来移動先の画像
                        break;
                    default:
                        // 観測所の名前のとき
                        game.createMapchipSprite(PIXI.utils.TextureCache["we1Texture"],i,j,offsetX,offsetY,1);
                        game.MapChipKansokujo(this.currentArea[i][j],i,j,offsetX,offsetY,2);
                        game.MapChipKansokujoWeather(this.currentArea[i][j],i,j,offsetX,offsetY,3,player);

                        // console.log("game.currentAreaにその他の値が入っています:"+this.currentArea[i][j]);
                        break;
                }
            }
        }//game.currenetAreaの背景スプライト描画終わり

    }// createTexture_from_currentArea終わり
}