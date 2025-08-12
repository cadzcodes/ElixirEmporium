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
        $response = Http::get("http://127.0.0.1:8000/cart/" . Auth::id());

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

        $cartItem = \App\Models\CartItem::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            \App\Models\CartItem::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Added to cart'], 200);
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
