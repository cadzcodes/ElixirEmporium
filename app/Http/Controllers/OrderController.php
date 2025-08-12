<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\Address;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{

    public function place(Request $request)
    {
        $user = Auth::user();

        $items = $request->input('items'); // array of { product_id, quantity, price }
        $shippingId = $request->input('shipping_id');
        $paymentMethod = $request->input('payment_method');

        $subtotal = collect($items)->sum(fn($item) => $item['price'] * $item['quantity']);
        $shippingFee = 100;
        $total = $subtotal + $shippingFee;

        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $shippingId,
            'payment_method' => $paymentMethod,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $total,
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

        // ✅ Remove the ordered items from user's cart
        $orderedProductIds = collect($items)->pluck('product_id')->toArray();

        \App\Models\CartItem::where('user_id', $user->id)
            ->whereIn('product_id', $orderedProductIds)
            ->delete();

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

        $orders = Order::with('items.product')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('M d, Y'),
                    'total' => $order->total,
                    'item_count' => $order->items->sum('quantity'),
                    'products' => $order->items->map(fn($i) => [
                        'name' => $i->product->name ?? 'Product',
                        'image' => $i->product->image ?? null,
                        'qty' => $i->quantity,
                    ]),
                ];
            });

        return response()->json($orders);
    }


}
