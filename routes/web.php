<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/cocktails', function () {
    return view('cocktails');
});

Route::get('/product', function () {
    return view('product');
});

Route::get('/about', function () {
    return view('about');
});
