<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;
use App\Http\Controllers\WebrtcStreamingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
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
require_once __DIR__ . "/channels.php";

Route::get('/', function () {
    return view('welcome');
});


Route::get('/eventshow', [Controller::class, 'eventshow']);
Route::get('/listener', function(){
 return view('listener');
});

// Auth::routes();
Route::get('/register', function(){
return view('auth.register');
})->name('register');

Route::get('/login', function() {
 return view('auth.login');
})->name('login');

Route::post('/logout', function() {
    Auth::logout();
    Session::invalidate();
    Session::flush();
    return redirect('/');
})->name('logout');

Route::post('/register', [RegisterController::class, 'create'])->name('register');
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::group(['middleware' => 'auth'], function () {
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/streamyard', function(){
    return view('boardcaster');
})->name('streamyard');

Route::get('/streaming', [WebrtcStreamingController::class, 'index']);
Route::get('/streaming/{streamId}', [WebrtcStreamingController::class, 'consumer']);
Route::post('/stream-offer', [WebrtcStreamingController::class, 'makeStreamOffer']);
Route::post('/stream-answer', [WebrtcStreamingController::class, 'makeStreamAnswer']);
Route::post('/authenticated', [WebrtcStreamingController::class, 'authenticated']);
});
