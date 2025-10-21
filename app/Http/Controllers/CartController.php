<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class CartController extends Controller
{
    public function index()
    {
        $apiBase = config('services.python_api.base_url');

        $response = Http::get($apiBase . "/cart/" . Auth::id());

        if ($response->failed()) {
            abort(500, 'Python API unavailable');
        }

        return response()->json($response->json());
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = auth()->user();

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $remaining = 10 - $cartItem->quantity;

            if ($remaining <= 0) {
                // Already at max
                return response()->json([
                    'message' => 'You already reached the max quantity (10) for this item.',
                    'added' => 0,
                    'current' => $cartItem->quantity,
                ], 200);
            }

            $toAdd = min($request->quantity, $remaining);
            $cartItem->increment('quantity', $toAdd);

            return response()->json([
                'message' => "Added {$toAdd} more to cart (max 10 per item).",
                'added' => $toAdd,
                'current' => $cartItem->quantity + $toAdd,
            ], 200);
        } else {
            // New item
            $toAdd = min($request->quantity, 10);
            $cartItem = CartItem::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $toAdd,
            ]);

            return response()->json([
                'message' => "Added {$toAdd} to cart (max 10 per item).",
                'added' => $toAdd,
                'current' => $toAdd,
            ], 200);
        }
    }


    public function update(Request $request, $id)
    {
        $item = CartItem::where('user_id', Auth::id())->findOrFail($id);
        $item->update(['quantity' => $request->quantity]);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = CartItem::where('user_id', Auth::id())->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Item removed']);
    }

    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Cart cleared']);
    }

    public function updateQuantity(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = session()->get('cart', []);

        if (isset($cart[$request->product_id])) {
            $cart[$request->product_id]['quantity'] = $request->quantity;
            session()->put('cart', $cart);
        }

        return response()->json(['status' => 'success']);
    }

    // CartController.php
    public function checkoutDetails(Request $request)
    {
        $items = $request->input('items', []); // [{ id, quantity }]

        $productData = [];

        foreach ($items as $item) {
            $product = Product::find($item['id']);
            if ($product) {
                $productData[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'image' => $product->image_url,
                    'quantity' => $item['quantity'],
                ];
            }
        }

        return response()->json($productData);
    }


}
