
export default class ItemMap{
    constructor() {
        this.itemMap=new Array();
        this.currentArea=new Array();
        this.loader = new PIXI.Loader();
    

    }
    setLoadTexture(){
        this.loader.add("money",'/storage/mapitem/money.png')

    }
    setItemMap(mapAry){//全体マップをコピーしてアイテムを置き換える

        // 2次元配列の初期化
        this.itemMap = new Array(mapAry.length);//移動のための2マス文多めにとる
        for(let y = 0; y < mapAry.length; y++) {
            this.itemMap[y] = new Array(mapAry[0].length).fill(0);
        }

        var ix = Math.floor( Math.random() * mapAry.length) ;
        var iy = Math.floor( Math.random() * mapAry[0].length) ;
        var ix2 = Math.floor( Math.random() * mapAry.length) ;
        var iy2 = Math.floor( Math.random() * mapAry[0].length) ;

        for(let mi=0; mi<mapAry.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<mapAry[0].length; mj++){//y0,y1がいくつあるか
                if(mapAry[mi][mj] != "9" && mapAry[ix][iy] != "9"){
                    this.itemMap[ix][iy]="money";
                }
                if(mapAry[mi][mj] != "9" && mapAry[ix2][iy2] != "9"){
                    this.itemMap[ix2][iy2]="money";
                }
                if(mapAry[mi][mj]=="1"){
                    this.itemMap[mi][mj]="money";
                }
                if(mapAry[mi][mj]=="p"){
                    this.itemMap[mi][mj]="p";

                }
                
            
            
            }
        }

    }// setItemMap終わり

    createItemMapTexture(itemCurrentArea,offsetX,offsetY,game){
        for(let mi=0; mi<itemCurrentArea.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<itemCurrentArea[0].length; mj++){//y0,y1がいくつあるか
                
                switch(itemCurrentArea[mi][mj]){
                    case "money":
                        game.createMapchipSprite(PIXI.utils.TextureCache["money"],mi,mj,offsetX,offsetY,2);
                    break;
                }
            
            
            }
        }
    }// createItemMapTexture終わり

    deleteItem(){
        
        for(let y = 0; y < this.itemMap.length; y++) {
            this.itemMap[y] = new Array(this.itemMap[0].length).fill(0);
        }

        for(let mi=0; mi<this.currentArea.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<this.currentArea[0].length; mj++){//y0,y1がいくつあるか
                this.currentArea[mi][mj]=0;
            }
        }
    }

}