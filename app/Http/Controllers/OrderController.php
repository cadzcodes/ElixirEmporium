<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

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


    public function show($id)
    {
        $order = Order::with(['items.product'])->findOrFail($id);

        $items = $order->items->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name ?? 'Product',
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
            ];
        });

        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'shipping_fee' => $order->shipping_fee,
            'total' => $order->total,
            'eta' => $order->eta,
            'items' => $items,
        ]);
    }


}
