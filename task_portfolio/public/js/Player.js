/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/Player.js":
/*!********************************!*\
  !*** ./resources/js/Player.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Player; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player = /*#__PURE__*/function () {
  function Player(x, y, dx, dy) {
    _classCallCheck(this, Player);

    this.x = x; //map上でのプレイヤの座標

    this.y = y;
    this.dir_x = dx; //map上でのプレイヤの方向座標

    this.dir_y = dy;
    this.items = new Array();
    this.localX = 6;
    this.localY = 8;
    this.status; //moveとattackのどちらか

    this.maxHp = 20;
    this.hp = 20;
    this.money;
    this.animeDir;
    this.mvCharacterAnime = [];
    this.loader = new PIXI.Loader();
  }

  _createClass(Player, [{
    key: "setLoadTexture",
    value: function setLoadTexture() {
      this.loader.add('we1', '/storage/mapchip/weed1.png');
      this.loader.add('pico0_1', '/storage/character/player/pico1.png'); //正面また下

      this.loader.add('pico0_2', '/storage/character/player/pico2.png');
      this.loader.add('pico0_3', '/storage/character/player/pico3.png');
      this.loader.add('pico1_1', '/storage/character/player/pico4.png'); //左

      this.loader.add('pico1_2', '/storage/character/player/pico5.png');
      this.loader.add('pico1_3', '/storage/character/player/pico6.png');
      this.loader.add('pico2_1', '/storage/character/player/pico7.png'); //上

      this.loader.add('pico2_2', '/storage/character/player/pico8.png');
      this.loader.add('pico2_3', '/storage/character/player/pico9.png');
      this.loader.add('pico3_1', '/storage/character/player/pico10.png'); //右

      this.loader.add('pico3_2', '/storage/character/player/pico11.png');
      this.loader.add('pico3_3', '/storage/character/player/pico12.png');
    }
  }, {
    key: "attack",
    value: function attack(game, animeDir, playerAnime, enemy, enemys) {
      var _this = this;

      var beforeOffsetX = 0;
      var beforeOffsetY = 0;
      var afterOffsetX = 0;
      var afterOffsetY = 0;

      switch (animeDir) {
        case "LEFT":
          beforeOffsetX = 48;
          afterOffsetX = -48;
          break;

        case "UP":
          beforeOffsetY = 48;
          afterOffsetY = -48;
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

      game.toriSound.play(); // game.playerAttackSound.play();

      setTimeout(function () {
        _this.dirMoveAnimetion(playerAnime, beforeOffsetX, beforeOffsetY);

        _this.enemyDamage(game, animeDir, playerAnime, enemy, enemys);

        setTimeout(function () {
          _this.dirMoveAnimetion(playerAnime, afterOffsetX, afterOffsetY);
        }, 100);
      }, 25);
    } // attack終わり
    //　プレイヤ攻撃先(向いている方向)にエネミーがいた場合ＨＰを減らす→０以下だった場合は消す。

  }, {
    key: "enemyDamage",
    value: function enemyDamage(game, animeDir, playerAnime, enemy, enemys) {
      for (var i = 0; i < enemys.length; i++) {
        if (enemys[i].exist == true) {
          if (animeDir == this.AttackDirectionDamageProcessing(enemys[i])) {
            enemys[i].hp -= 2;
          }

          ;

          if (enemys[i].hp <= 0) {
            //　ローカル座標とワールド座標からも消す。
            console.log("消去対象の値は？" + enemy.enemyMap[enemys[i].x][enemys[i].y]);
            console.log("消去対象の値は？" + enemy.currentArea[enemys[i].localX][enemys[i].localY]);
            enemy.enemyMap[enemys[i].x][enemys[i].y] = 0;
            enemy.currentArea[enemys[i].localX][enemys[i].localY] = 0; // ステージからも消す。

            game.app.stage.removeChild(enemys[i].enemyAnime); //オブジェクトの破棄をしようと思ったけど、倒したエネミーを表示領域に入れないようにしておく。

            enemys[i].x = -1;
            enemys[i].y = -1;
            enemys[i].localX = -1;
            enemys[i].localY = -1;
          }
        }
      }
    }
  }, {
    key: "AttackDirectionDamageProcessing",
    value: function AttackDirectionDamageProcessing(enemy) {
      if (enemy.localX == this.localX && enemy.localY == this.localY - 1) {
        //エネミーはプレイヤの左にいる
        return "LEFT";
      }

      if (enemy.localX == this.localX - 1 && enemy.localY == this.localY) {
        //上
        return "UP";
      }

      if (enemy.localX == this.localX && enemy.localY == this.localY + 1) {
        //右
        return "RIGHT";
      }

      if (enemy.localX == this.localX + 1 && enemy.localY == this.localY) {
        //下
        return "DOWN";
      }

      return false;
    }
  }, {
    key: "dirMoveAnimetion",
    value: function dirMoveAnimetion(playerAnime, offsetX, offsetY) {
      if (offsetX == 48 && offsetY == 0) {
        TweenMax.to(playerAnime, 0.100, {
          pixi: {
            x: playerAnime.x - 30
          },
          ease: Power0.easeNone,
          repeat: 0
        });
      } else if (offsetX == -48 && offsetY == 0) {
        TweenMax.to(playerAnime, 0.100, {
          pixi: {
            x: playerAnime.x + 30
          },
          ease: Power0.easeNone,
          repeat: 0
        });
      } else if (offsetX == 0 && offsetY == 48) {
        TweenMax.to(playerAnime, 0.100, {
          pixi: {
            y: playerAnime.y - 30
          },
          ease: Power0.easeNone,
          repeat: 0
        });
      } else if (offsetX == 0 && offsetY == -48) {
        TweenMax.to(playerAnime, 0.100, {
          pixi: {
            y: playerAnime.y + 30
          },
          ease: Power0.easeNone,
          repeat: 0
        });
      }
    } // dirMoveAnimetion終わり

  }, {
    key: "walkAnimetion",
    value: function walkAnimetion(direction) {
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
      var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 8;
      var game = arguments.length > 3 ? arguments[3] : undefined;
      game.app.stage.removeChild(this.mvCharacterAnime[0]);
      var ttCharacter = [];

      switch (direction) {
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
      } // 参考　https://ryo620.org/2016/12/pixijs-game-01/


      if (this.animeDir != direction) {
        // 前と移動方向が異なるとき
        console.log("前と移動方向が異なるとき");
        this.animeDir = direction;
        this.mvCharacterAnime = []; // アニメーションを再セット
        //　テクスチャの配列をオブジェクトに入れる。

        this.mvCharacterAnime.push(new PIXI.extras.AnimatedSprite(ttCharacter));
      } else {
        console.log("前と移動方向が同じとき");
        this.animeDir = direction;
      }

      this.mvCharacterAnime[0].play(); // アニメーションスタート

      this.mvCharacterAnime[0].animationSpeed = 0.07; // アニメーション速度

      this.mvCharacterAnime[0].zIndex = 15;
      this.mvCharacterAnime[0].scale.x = this.mvCharacterAnime[0].scale.y = 1.5; //　元々の画像が32pxのばかり使ってるのため、48pxは想定外

      this.mvCharacterAnime[0].x = j * 48 - 48;
      this.mvCharacterAnime[0].y = i * 48 - 48;
      game.app.stage.addChild(this.mvCharacterAnime[0]); //　コンテナにキャラを入れるとzIndexが動かないのでとりあえずいれない
      // this.gameScene1.addChild(this.mvCharacterAnime[0]); //コンテナにスプライトを入れる
      // this.app.stage.addChild(this.gameScene1);    
    }
  }, {
    key: "set",
    value: function set(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: "getX",
    value: function getX() {
      return this.x;
    }
  }, {
    key: "getY",
    value: function getY() {
      return this.y;
    }
  }, {
    key: "setDirTip",
    value: function setDirTip(dx, dy) {
      this.dir_x = dx;
      this.dir_y = dy;
    }
  }, {
    key: "getDirX",
    value: function getDirX() {
      return this.dir_x;
    }
  }, {
    key: "getDirY",
    value: function getDirY() {
      return this.dir_y;
    }
  }]);

  return Player;
}();



/***/ }),

/***/ 2:
/*!**************************************!*\
  !*** multi ./resources/js/Player.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Program Files\Git\mysite\task_portfolio\resources\js\Player.js */"./resources/js/Player.js");


/***/ })

/******/ });