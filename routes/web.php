<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectIfAuthenticatedToHome;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
use App\Models\Product;

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

// Submit Forms Routes
Route::post('/register', [AuthController::class, 'register']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware([RedirectIfAuthenticatedToHome::class])->group(function () {
    Route::get('/login', function () {
        return view('auth/login'); // Replace as needed for React/Blade
    });

    Route::get('/register', function () {
        return view('auth/register');
    });
});

Route::get('/user', function () {
    return response()->json(Auth::user());
});

Route::post('/logout', function (Request $request) {
    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully'], 200);
});


Route::get('/products/index', [ProductController::class, 'index'])->name('products.index');

Route::get('/product/{slug}', function ($slug) {
    $product = Product::where('slug', $slug)->firstOrFail();
    return view('product', ['product' => $product]);
});