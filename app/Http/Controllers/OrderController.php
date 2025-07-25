<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\Address;

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
        $order = Order::with(['items.product', 'address'])->findOrFail($id);

        if (!$order->address) {
            \Log::warning("Order {$id} has no address. Address ID: " . $order->address_id);
        }

        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'shipping_fee' => $order->shipping_fee,
            'total' => $order->total,
            'eta' => $order->eta,
            'created_at' => $order->created_at,
            'items' => $order->items->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name ?? 'Product',
                    'quantity' => $item->quantity,
                    'image' => $item->product->image ?? null,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ];
            }),
            'shipping' => $order->address ? [
                'name' => $order->address->full_name,
                'phone' => $order->address->phone,
                'address1' => $order->address->address, // formerly line1
                'address2' => collect([
                    $order->address->unit_number,
                    $order->address->barangay,
                    $order->address->city,
                    $order->address->province,
                ])->filter()->join(', '), // safe concatenation
                'type' => $order->address->type,
            ] : null,
        ]);
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
