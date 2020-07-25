const ViewWidth=13;
const ViewHeight=17;

export default class ViewArea{
    // 第一引数mapAryはgeneralMapとitemMapが渡される。第二引数でマップのpの位置を探してプレイヤエリアを導き出す
    getFirstPlayerArea(mapAry,player,target){
        // 2次元配列の初期化
        let currentArea = new Array(ViewWidth);// 移動のための2マス文多めにとる
        for(let y = 0; y < ViewWidth; y++) {
            currentArea[y] = new Array(ViewHeight).fill(0);
        }

        // 移動可能な時に更新されたmapのpを元に、マップからプレイヤ描画エリアの配列を作成
        let xx=0;
        let yy=0;
        for(let mi=0; mi<mapAry.length; mi++){// マップのx1,x2がいくつあるか
            for(let mj=0; mj<mapAry[0].length; mj++){// y0,y1がいくつあるか

                if(mapAry[mi][mj] == target){// map上のプレイヤーの位置を求める
                    player.set(mi,mj);   // 見つけたときのpの座標を保存する。(衝突判定に使う)
                    player.setDirTip(mi+1,mj); // プレイヤの向いている座標をセット(初期は下方向)
                    // console.log("マップの中でのp座標:"+mi+","+mj);
                    for(let i = (mi-6); i < mi+7; i++){//mapのキャラを中心としたcurrentAreaの左上から
                        for(let j = (mj-8); j < mj+9; j++){//currentAreaの右下の座標まで(オフセット２マス分含む)
                            //マップデータの一部をプレイヤーエリアにする
                            // console.log("pが見つかりました");
                            // console.log("[xx][yy]=mapAry[mi][mj]:"+xx+","+yy+","+mi+","+mj);
                            // console.log("mapAry[i][j]:"+i+","+j);
                            currentArea[xx][yy]=mapAry[i][j];
                            yy += 1;
                        }
                        yy = 0;
                        xx += 1;// １行入れ終えたら1列下げる
                    }
                }
            }
        }
        return currentArea;
    }// getPlayArea終了


    // プレイヤの座標を元にプレイヤエリアを導き出す
    getPlayerArea(mapAry,player){
        // 2次元配列の初期化
        let currentArea = new Array(ViewWidth);//移動のための2マス文多めにとる
        for(let y = 0; y < ViewWidth; y++) {
            currentArea[y] = new Array(ViewHeight).fill(0);
        }

        //移動可能な時に更新されたmapのpを元に、マップからプレイヤ描画エリアの配列を作成
        let xx=0;
        let yy=0;
        for(let mi=0; mi<mapAry.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<mapAry[0].length; mj++){//y0,y1がいくつあるか

                if(mi == player.getX() && mj==player.getY()){//map上のプレイヤーの位置を求める
                    // console.log("マップの中でのp座標:"+mi+","+mj);

                    for(let i = (mi-6); i < mi+7; i++){//mapのキャラを中心としたcurrentAreaの左上から
                        for(let j = (mj-8); j < mj+9; j++){//currentAreaの右下の座標まで(オフセット２マス分含む)
                            //マップデータの一部をプレイヤーエリアにする
                            // console.log("pが見つかりました");
                            // console.log("[xx][yy]=mapAry[mi][mj]:"+xx+","+yy+","+mi+","+mj);
                            // console.log("mapAry[i][j]:"+i+","+j);
                            currentArea[xx][yy]=mapAry[i][j];
                            yy += 1;
                        }
                        yy = 0;
                        xx += 1;//１行入れ終えたら1列下げる
                    }
                }
            }
        }
        return currentArea;
    }//getPlayArea終了
    getPlayer_Enemys_Area(mapAry,player,enemys){
        // 2次元配列の初期化
        let currentArea = new Array(ViewWidth);//移動のための2マス文多めにとる
        for(let y = 0; y < ViewWidth; y++) {
            currentArea[y] = new Array(ViewHeight).fill(0);
        }

        //すべてのエネミーのフラグをリセットする。
        for(let i1=0;i1<enemys.length;i1++){
            enemys[i1].exist=false;
        }
        //移動可能な時に更新されたmapのpを元に、マップからプレイヤ描画エリアの配列を作成
        let xx=0;
        let yy=0;
        for(let mi=0; mi<mapAry.length; mi++){//マップのx1,x2がいくつあるか
            for(let mj=0; mj<mapAry[0].length; mj++){//y0,y1がいくつあるか

                if(mi == player.getX() && mj==player.getY()){//map上のプレイヤーの位置を求める
                    // console.log("マップの中でのp座標:"+mi+","+mj);

                    for(let i = (mi-6); i < mi+7; i++){//mapのキャラを中心としたcurrentAreaの左上から
                        for(let j = (mj-8); j < mj+9; j++){//currentAreaの右下の座標まで(オフセット２マス分含む)

                            currentArea[xx][yy]=mapAry[i][j];
                            if(currentArea[xx][yy]=="p"){ //(enemy独自仕様)
                                currentArea[xx][yy]=0;
                            }
                            // ローカルエリアにエネミーのワールド座標が入っていたらそのエネミーをアクティブにする。
                            // アクティブになったエネミーにローカル座標を設定する。
                            for(let i1=0;i1<enemys.length;i1++){
                                if(enemys[i1].x >= (mi-6)  && enemys[i1].x < (mi+7)){
                                    if(enemys[i1].y >= (mj-8)  && enemys[i1].y < (mj+9)){
                                        if(enemys[i1].x == i && enemys[i1].y == j){
                                            enemys[i1].localX = xx; 
                                            enemys[i1].localY = yy;
                                            enemys[i1].exist=true;
                                        }
                                    }
                                }
                            }


                            yy += 1;
                        }
                        yy = 0;
                        xx += 1;//１行入れ終えたら1列下げる
                    }
                    currentArea[6][8]="p"; //中心にpを据えたエリアにする。(enemy独自仕様)
                }
            }
        }
        return currentArea;
    }// getPlayer_Enemys_Area終わり
}