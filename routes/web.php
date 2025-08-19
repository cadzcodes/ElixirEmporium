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
use App\Http\Controllers\AddressController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ViewController;
use App\Http\Controllers\ContactController;
use App\Models\Order;

// Public pages
Route::view('/', 'welcome');
Route::view('/cocktails', 'cocktails');
Route::view('/product', 'product');
Route::view('/about', 'about');
Route::view('/art', 'art');
Route::view('/contact', 'contact');
Route::get('/account', function (Request $request) {
    $user = auth()->user()->load('addresses');
    $defaultTab = $request->query('tab', 'profile'); // fallback to profile if not set
    return view('account', compact('user', 'defaultTab'));
})->middleware(RedirectIfGuestToHome::class);
Route::view('/cart', 'cart');
Route::view('/checkout', 'checkout');
Route::view('/signup', 'auth.signup')->middleware(RedirectIfAuthenticatedToHome::class);
Route::view('/login', 'auth.login')->middleware(RedirectIfAuthenticatedToHome::class);
Route::view('/orderdetails', 'order-details');


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
    Route::post('/cart/checkout-details', [CartController::class, 'checkoutDetails']);
});

Route::middleware('auth')->group(function () {
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::put('/addresses/{id}/default', [AddressController::class, 'setDefault']);
    Route::patch('/addresses/{id}/default', [AddressController::class, 'setDefault']);
});

Route::middleware('auth')->post('/orders/place', [OrderController::class, 'place']);

Route::get('/order-confirmation', function () {
    return view('order-confirmation');
})->middleware(['auth']);

Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware(['auth']);

Route::get('/order-details/{id}', [ViewController::class, 'orderDetailsPage'])->middleware('auth');

Route::get('/my-orders', [OrderController::class, 'getMyOrders']);

Route::get('/payment/success/{order}', function ($orderId) {
    $order = Order::findOrFail($orderId);
    // Optionally check payment status via PayMongo API
    $order->update(['status' => 'Order Placed']);
    return redirect('/order-confirmation?order_id=' . $order->id);
})->name('payment.success');

Route::get('/payment/cancel/{order}', function ($orderId) {
    return redirect('/checkout')->with('error', 'Payment cancelled.');
})->name('payment.cancel');

Route::post('/webhook/paymongo', function (Request $request) {
    $event = $request->input('data.attributes.type');

    if ($event === 'payment.paid') {
        $paymentId = $request->input('data.attributes.data.id');
        // If you stored PayMongo payment ID in the order, find it and mark as paid
        Order::where('paymongo_payment_id', $paymentId)->update(['status' => 'Order Placed']);
    }

    return response()->json(['status' => 'ok']);
});

Route::get('/payment/success/{order}', [OrderController::class, 'paypalSuccess'])->name('payment.success');
Route::get('/payment/cancel/{order}', [OrderController::class, 'paypalCancel'])->name('payment.cancel');

Route::post('/contact', [ContactController::class, 'send']);

Route::get('/test-cookie', function () {
    setcookie('test', 'value', time() + 3600, '/', '.elixiremporium.test');
    return response('Cookie set')->cookie('laravel_test', 'working');
});