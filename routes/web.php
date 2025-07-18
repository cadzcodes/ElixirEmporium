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

Route::get('/login', function () {
    return view('auth/login');
});

Route::get('/signup', function () {
    return view('auth/signup');
});

Route::get('/art', function () {
    return view('art');
});


Route::get('/contact', function () {
    return view('contact');
});

Route::get('/cart', function () {
    return view('cart');
});

Route::get('/checkout', function () {
    return view('checkout');
});
