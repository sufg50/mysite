<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
    
});
Route::get('/test', function () {
    return view('forum/getelevation');
    
});


//掲示板関連
Route::group(['prefix' => 'forum'],function(){
    Route::get('index','ForumController@index')->name('forum.index'); 
    Route::get('create','ForumController@create')->name('forum.create'); 
    Route::post('store','ForumController@store')->name('forum.store'); 
    Route::get('show/{id}', 'ForumController@show')->name('forum.show');
    Route::post('show_store','ForumController@show_store')->name('forum.show_store'); 
 });

//トップページ。ユーザー名等が右タブで中央にゲーム画面があるページ。
    Route::group(['prefix' => 'top', 'middleware' => 'auth'],function(){
    Route::get('index','TopPageController@index')->name('top.index'); 
});

 //ユーザー関連
    Route::group(['prefix' => 'user', 'middleware' => 'auth'],function(){
    Route::get('profile','UserController@profile')->name('user.profile'); 
    Route::get('edit/{id}','UserController@edit')->name('user.edit'); 
    Route::post('update/{id}','UserController@update')->name('user.update'); 
});
//誰かを検索する
Route::group(['prefix' => 'who_search', 'middleware' => 'auth'],function(){
    Route::get('index','WhoSearch@index')->name('who_search.index'); 
    Route::post('apply','WhoSearch@apply')->name('who_search.apply'); 

});
//フレンド一覧
Route::group(['prefix' => 'friend', 'middleware' => 'auth'],function(){
    Route::get('index','FriendController@index')->name('friend.index'); 
});
//トーク
Route::group(['prefix' => 'tolk', 'middleware' => 'auth'],function(){
    Route::post('index','TolkController@index')->name('tolk.index'); 
    Route::get('get_data','TolkController@get_data')->name('tolk.get_data'); 
    Route::post('add_data','TolkController@add_data')->name('tolk.add_data'); 
    Route::post('create','TolkController@create')->name('tolk.create'); 
    Route::get('store','TolkController@store')->name('tolk.store'); 


});
//iframe内ゲーム
Route::group(['prefix' => 'game', 'middleware' => 'auth'],function(){
    Route::get('index','MainGameController@index')->name('game.index'); 
});

    // Route::post('store', 'ContactFormController@store')->name('contact.store');
    // Route::get('show/{id}', 'ContactFormController@show')->name('contact.show');
    // Route::get('edit/{id}', 'ContactFormController@edit')->name('contact.edit');
    // Route::post('update/{id}', 'ContactFormController@update')->name('contact.update');
    // Route::post('destroy/{id}', 'ContactFormController@destroy')->name('contact.destroy');


Auth::routes();
Route::get('/home', 'HomeController@index')->name('home');
