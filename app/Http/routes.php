<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

Route::post('/lottery_numbers', 'LotteryNumberController@saveNumbers');

//change 1
//change 2
//change 3
//cahnge 4
//change 5
//cahnge 6
