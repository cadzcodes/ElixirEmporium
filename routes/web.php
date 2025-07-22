<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Models\Product;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\RedirectIfAuthenticatedToHome;
use App\Http\Middleware\RedirectIfGuestToHome;



// Public pages
Route::view('/', 'welcome');
Route::view('/cocktails', 'cocktails');
Route::view('/product', 'product');
Route::view('/about', 'about');
Route::view('/art', 'art');
Route::view('/contact', 'contact');
Route::view('/account', 'account')->middleware(RedirectIfGuestToHome::class);
Route::view('/cart', 'cart');
Route::view('/checkout', 'checkout');
Route::view('/signup', 'auth.signup')->middleware(RedirectIfAuthenticatedToHome::class);
Route::view('/login', 'auth.login')->middleware(RedirectIfAuthenticatedToHome::class);

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/update-profile', [ProfileController::class, 'update'])->middleware('auth');


Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully'], 200);
})->middleware('auth');

// Get the currently logged-in user (for your React frontend to check session)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth');

// Product routes
Route::get('/products/index', [ProductController::class, 'index'])->name('products.index');

// Dynamic product page (e.g. /product/some-slug)
Route::get('/product/{slug}', function ($slug) {
    $product = Product::where('slug', $slug)->firstOrFail();
    return view('product', ['product' => $product]);
});


Route::middleware('auth')->group(function () {
    Route::get('/cart/items', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'store']);
    Route::put('/cart/items/{id}', [CartController::class, 'update']);
    Route::delete('/cart/items/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
});