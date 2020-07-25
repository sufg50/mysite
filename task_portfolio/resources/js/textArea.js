export default class TextArea{
    constructor(){
        this.hpText;// 白ぶち
        this.hpText2;// 黒ぶち
        this.hpText3;// 赤色ＨＰ
        this.hp1;// プレイヤーの現在のHP/maxHP＊98
        this.money;
        this.moneyText;
        this.kaisouCircle;
        this.kaisouText;
        this.choiceTriangle;
    }
    weatherDate(game){
        let rainfallsDateText =  new PIXI.Text(game.rainfallsDate+"更新", 
                { 
                //   fontFamily: 'Arial',   // フォント
                  fontSize: 15,
                  fill : 0x000000,       // 文字色
                //   stroke: 0x000000,      // アウトラインの色
                //   strokeThickness: 1,    // アウトラインの太さ   
                //   align: 'center',       // 文字揃え(複数行の場合に有効)     
                });
        rainfallsDateText.x = game.app.screen.width+30-game.app.screen.width;
        rainfallsDateText.y = game.app.screen.height-20;
        rainfallsDateText.zIndex=40;
        // text.text = '0123\n456789';   // テキストの書き換え
        game.app.stage.addChild(rainfallsDateText);
    }

    gold(player,game){// なぜかキーボード押すとテキストエリアが消える。
        game.app.stage.removeChild(this.moneyText);
        this.moneyText =  new PIXI.Text(player.money+" G", 
                { 
                //   fontFamily: 'Arial',   // フォント
                  fontSize: 20,
                  fill : 0xFFFFFF,       // 文字色
                  stroke: 0x000000,      // アウトラインの色
                  strokeThickness: 3,    // アウトラインの太さ   
                //   align: 'center',       // 文字揃え(複数行の場合に有効)     
                });
        this.moneyText.x = game.app.screen.width-70;
        this.moneyText.y = 10;
        this.moneyText.zIndex=40;
        // text.text = '0123\n456789';   // テキストの書き換え
        game.app.stage.addChild(this.moneyText);
    }


    hp(player,game){
        game.app.stage.removeChild(this.hpText3);
        this.hpText = new PIXI.Graphics()//白ぶち
        // .beginFill(0x0000FF, 0.3)     //色,透明度
        .lineStyle(2, 0xFFFFFF)
        .drawRoundedRect(100,20,100,10,2)
        .endFill();
        this.hpText.zIndex=20;
        game.app.stage.addChild(this.hpText);

        this.hpText2 = new PIXI.Graphics()//黒ぶち
        // .beginFill(0x0000FF, 0.3)     //色,透明度
        .lineStyle(1, 0x000000)
        .drawRoundedRect(99,18,103,13,2)
        .endFill();
        this.hpText2.zIndex=20;
        game.app.stage.addChild(this.hpText2);

        this.hp1=(player.hp/player.maxHp)*98;
        if(this.hp1<=0)this.hp1=0;

        this.hpText3 = new PIXI.Graphics()//黒ぶち
        .beginFill(0xFF0000, 0.7)     //色,透明度
        .drawRect(101,21,this.hp1,8)
        .endFill();
        this.hpText3.zIndex=20;
        game.app.stage.addChild(this.hpText3);


        // this.choiceTriangle = new PIXI.Graphics()
        // .beginFill(0xFFFFFF, 0.8)    // 第二引数で透明度を指定できる
        // .drawPolygon([  // 頂点を配列で渡す [x1,y1,x2,y2,....]
        //                 0, 0,  //左上
        //                 0, 16, //左下
        //                 8, 8,  //右真ん中

        //             ])
        // .endFill();
        // this.choiceTriangle.x = this.currentText.x-15;
        // this.choiceTriangle.y = this.currentText.y+9;
        // this.choiceTriangle.zIndex=25;
        // this.app.stage.addChild(this.choiceTriangle)
    
    }

    kaisouMove(game,text){
        this.kaisouCircle = new PIXI.Graphics()
        .beginFill(0x0000FF, 0.3)     //色,透明度
        .lineStyle(2, 0x000000)
        .drawRoundedRect(game.app.screen.width/2-140,game.app.screen.height/2-40,280,80,10)
        .endFill();
        this.kaisouCircle.zIndex=100;
        game.app.stage.addChild(this.kaisouCircle);

        this.kaisouText =  new PIXI.Text(text, 
                { 
                    fontFamily: 'メイリオ',   // フォント
                    fontSize: 23,
                    fill : 0xFFFFFF,       // 文字色
                    stroke: 0xFFFFFF,      // アウトラインの色
                    strokeThickness: 1,    // アウトラインの太さ   
                //   align: 'center',       // 文字揃え(複数行の場合に有効)     
                });    
        this.kaisouText.x = game.app.screen.width/2-140+35;
        this.kaisouText.y = game.app.screen.height/2-40+22;
        this.kaisouText.zIndex=100; 
        //x位置,y位置,xスケール,yスケール,回転,xスキュー,yスキュー,xピポッド,yピポッド
        // this.kaisouText.setTransform(this.kaisouText.x, this.kaisouText.y, 1, 1,  0,  0,0.2,  1,1 );
        game.app.stage.addChild(this.kaisouText);

        this.choiceTriangle = new PIXI.Graphics()
        .beginFill(0xFFFFFF, 0.8)    // 第二引数で透明度を指定できる
        .drawPolygon([  // 頂点を配列で渡す [x1,y1,x2,y2,....]
                        0, 0,  //左上
                        0, 16, //左下
                        8, 8,  //右真ん中

                    ])
        .endFill();
        this.choiceTriangle.x = this.kaisouText.x-15;
        this.choiceTriangle.y = this.kaisouText.y+9;
        this.choiceTriangle.zIndex=100;
        game.app.stage.addChild(this.choiceTriangle)

        //選択肢のアイコン▷の点滅
        setTimeout(() => {
            
            this.choiceTriangle.alpha=0;
            setTimeout(() => {
                this.choiceTriangle.alpha=1;
            }, 500);
        }, 500);
            
        
    }
    delete(game){
        game.app.stage.removeChild(this.hpText);
        game.app.stage.removeChild(this.hpText2);
        game.app.stage.removeChild(this.hpText3);
    }
}