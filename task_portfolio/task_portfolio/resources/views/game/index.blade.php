<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        
        <title>pixi.js写経</title>

        {{-- <link rel="stylesheet" type="text/css" media="screen" href="./css/sample.css" /> --}}

        <!-- pixi.jsの本体の読み込み -->
        <script type="text/javascript" src="{{ asset('js/pixi.min.js') }}"></script>

        <!-- アニメーション用のライブラリ(GSAP/TweenMax)の読み込み -->
        <script type="text/javascript" src="{{ asset('js/gsap.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/PixiPlugin.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/pixi-sound.js') }}"></script>

        {{-- インポートに失敗したプラグイン--}}
        {{-- <script type="text/javascript" src="{{ asset('js/PixelateFilter.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/pixi-layers.js') }}"></script> --}}
        <script src="https://cdn.jsdelivr.net/npm/pixi-filters@latest/dist/pixi-filters.js"></script>

        <!-- 外部フォント読み込み用のライブラリの読み込み -->
        {{-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script> --}}
        <!-- 外部フォントの定義用css(sample.css等とまとめてしまっても問題ありません) -->
        <!-- <link rel="stylesheet" type="text/css" media="screen" href="./css/font.css" /> -->
    </head>
    <style>
        html{
            margin:0;
            padding:0;
        }
        /* htmlにできる謎の余白を消す */
        /* jsファイルをいじったらmarginとかが０になってる不具合起きるかも */
        * {
            box-sizing: border-box;
            margin:0;
            padding:0;
        }
    </style>
    <body>
        
        <main id="app">
            <!-- ここにPixiの描画領域(Canvas)が入る -->
        </main>
    </body>
    <script type="text/javascript" src="{{ asset('js/main.js') }}"></script>
</html>