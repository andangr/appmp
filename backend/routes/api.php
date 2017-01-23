<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

/*Route::get('/user', function (Request $request) {
return $request->user();
})->middleware('auth:api');*/

Route::group(['middleware' => ['cors'], 'namespace' => 'Api'], function () {
    Route::post('forgot_password', 'Sessions\ApiForgotPasswordController@forgotPassword')->name('forgot_password');

    Route::post('social_login', 'Sessions\ApiSocialLoginController@socialLogin')->name('social_login');

    Route::group(['middleware' => ['auth:api']], function () {
        Route::resource('vouchers', 'ApiVouchersController', ['except' => ['create', 'edit']]);
        Route::resource('users', 'ApiUsersController', ['except' => ['create', 'edit']]);
    });
});