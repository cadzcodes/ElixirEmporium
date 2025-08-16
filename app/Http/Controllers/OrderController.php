<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\CartItem;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\Address;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{

    public function place(Request $request)
    {
        $user = Auth::user();

        $items = $request->input('items');
        $shippingId = $request->input('shipping_id');
        $paymentMethod = $request->input('payment_method');

        $subtotal = collect($items)->sum(fn($item) => $item['price'] * $item['quantity']);
        $shippingFee = 100;
        $total = $subtotal + $shippingFee;

        // 1️⃣ Create order in DB
        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $shippingId,
            'payment_method' => $paymentMethod,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $total,
            'status' => 'pending', // so it's updated after payment
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
        }

        // Remove from cart
        $orderedProductIds = collect($items)->pluck('product_id')->toArray();
        CartItem::where('user_id', $user->id)
            ->whereIn('product_id', $orderedProductIds)
            ->delete();

        // 2️⃣ If payment is GCash or Maya, create PayMongo checkout session
        if (in_array($paymentMethod, ['gcash', 'paymaya'])) {
            $session = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'line_items' => [
                                [
                                    'name' => 'Order #' . $order->id,
                                    'amount' => intval($total * 100), // centavos
                                    'currency' => 'PHP',
                                    'quantity' => 1,
                                ]
                            ],
                            'payment_method_types' => [$paymentMethod],
                            'success_url' => route('payment.success', ['order' => $order->id]),
                            'cancel_url' => route('payment.cancel', ['order' => $order->id]),
                        ]
                    ]
                ])->json();

            if (isset($session['data']['attributes']['checkout_url'])) {
                return response()->json([
                    'redirect_url' => $session['data']['attributes']['checkout_url']
                ]);
            }

            return response()->json(['error' => 'Failed to create PayMongo session'], 500);
        }

        // 3️⃣ Otherwise, proceed as normal (e.g., COD)
        return response()->json([
            'message' => 'Order placed',
            'order_id' => $order->id
        ]);
    }



    public function show(Request $request, $id)
    {
        // The base URL of your Python API
        $apiBase = config('services.python_api.base_url', 'http://127.0.0.1:8000');

        // Call the FastAPI endpoint, sending the user ID from the authenticated user
        $response = Http::withHeaders([
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

        $response = Http::get("{$apiBase}/orders/user/{$user->id}");

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch orders',
                'error' => $response->json(),
            ], $response->status());
        }

        return response()->json($response->json());
    }

}
