<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            [
            'name' => 'ルルコ',
            'email' => 'test1@test.com',
            'password' => Hash::make('password'),
            
        ],[
            'name' => 'アリス',
            'email' => 'test2@test.com',
            'password' => Hash::make('password'),
        ],
        [
            'name' => 'ルルナ',
            'email' => 'test3@test.com',
            'password' => Hash::make('password'),
        ]]
    );

            DB::table('user_names')->insert([
            [
                'id' => '1',
                'user_name' => 'ルルコ',
                
            ],[
                'id' => '2',
                'user_name' => 'アリス',
            ],
            [
                'id' => '3',
                'user_name' => 'ルルナ',
            ]]
        );

        DB::table('user_photos')->insert([
            [
                'id' => '1',
                'user_photo' => '1.jpg',
            
            ],[
                'id' => '2',
                'user_photo' => '2.jpg',
            ],
            [
                'id' => '3',
                'user_photo' => '3.jpg',
            ]]
            );

            DB::table('my_self_introductions')->insert([
                [
                    'id' => '1',
                    'my_self_introduction' => 'ようこそ我が家へ。今何していますか？誰でも連絡ください。ヒマです。',
                
                ],[
                    'id' => '2',
                    'my_self_introduction' => 'よろしく。魔法使いよ。',
                ],
                [
                    'id' => '3',
                    'my_self_introduction' => 'ハロハロ',
                ]]
                );

    }
}
