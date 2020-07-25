<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema; // herokuのために追記



class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //herokuのために追記右の通りに行ったhttps://colorfree-map.com/heroku-laravel/%20
        Schema::defaultStringLength(191);
        if (\App::environment('production')) {
            \URL::forceScheme('https');
        } // 追加
    }
}
