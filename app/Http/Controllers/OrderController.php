<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\CartItem;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected PaymentGatewayManager $paymentGatewayManager;

    public function __construct(PaymentGatewayManager $paymentGatewayManager)
    {
        $this->paymentGatewayManager = $paymentGatewayManager;
    }

    public function place(Request $request)
    {
        $user = Auth::user();
        $items = $request->input('items');
        $shippingId = $request->input('shipping_id');
        $paymentMethod = $request->input('payment_method');

        $subtotal = collect($items)->sum(fn($item) => $item['price'] * $item['quantity']);
        $shippingFee = 100;
        $total = $subtotal + $shippingFee;

        DB::beginTransaction(); // ✅ wrap in transaction to avoid half-updates

        try {
            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $shippingId,
                'payment_method' => $paymentMethod,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'status' => 'pending',
                'eta' => now()->addDays(3),
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                // ✅ decrement stock
                Product::where('id', $item['product_id'])
                    ->where('stocks', '>=', $item['quantity']) // prevent negative stock
                    ->decrement('stocks', $item['quantity']);
            }

            // Send confirmation email...
            Mail::send('emails.order_confirmation', [
                'user' => $user,
                'order' => $order,
                'items' => $items
            ], function ($mail) use ($user, $order) {
                $mail->to($user->email, $user->name)
                    ->subject('Order Confirmation - Order #' . $order->id);
            });

            // Remove from cart
            CartItem::where('user_id', $user->id)
                ->whereIn('product_id', collect($items)->pluck('product_id'))
                ->delete();

            // ✅ Get correct gateway
            $gateway = $this->paymentGatewayManager->resolve($paymentMethod);

            $redirectUrl = $gateway->createCheckout($order, $total);

            DB::commit(); // ✅ commit only after everything passes

            if ($redirectUrl) {
                return response()->json(['redirect_url' => $redirectUrl]);
            }

            return response()->json([
                'message' => 'Order placed',
                'order_id' => $order->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // ❌ rollback on error

            return response()->json([
                'error' => 'Order failed: ' . $e->getMessage()
            ], 500);
        }
    }
    public function paymentSuccess(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);

        // ✅ Resolve gateway dynamically
        $gateway = $this->paymentGatewayManager->resolve($order->payment_method);

        $gateway->handleSuccess($request, $orderId);

        $order->status = 'Order Placed';
        $order->save();

        return redirect()->to("/order-confirmation?order_id={$order->id}");
    }

    public function paypalSuccess(Request $request, $orderId)
    {
        $paypalOrderId = $request->query('token'); // PayPal sends ?token=EC-xxxx

        // 1️⃣ Get access token again
        $auth = Http::asForm()->withBasicAuth(
            env('PAYPAL_CLIENT_ID'),
            env('PAYPAL_SECRET')
        )->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ])->json();

        $accessToken = $auth['access_token'] ?? null;

        // 2️⃣ Capture payment
        $capture = Http::withToken($accessToken)
            ->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/{$paypalOrderId}/capture")
            ->json();

        // 3️⃣ Update order status
        $order = Order::findOrFail($orderId);
        $order->status = 'Order Placed';
        $order->save();

        return redirect()->to("/order-confirmation?order_id={$order->id}");
    }



    public function show(Request $request, $id)
    {
        $apiBase = config('services.python_api.base_url', 'http://127.0.0.1:8000');

        $response = \Http::withHeaders([
            'X-User-ID' => $request->user()->id,
        ])->get("{$apiBase}/orders/{$id}");

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch order details',
                'error' => $response->json(),
            ], $response->status());
        }

        return response()->json($response->json());
    }

    public function getMyOrders()
    {
        $user = Auth::user();
        $apiBase = config('services.python_api.base_url', 'http://127.0.0.1:8000');

        $response = \Http::get("{$apiBase}/orders/user/{$user->id}");

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch orders',
                'error' => $response->json(),
            ], $response->status());
        }

        return response()->json($response->json());
    }
}
