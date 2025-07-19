<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    // Return a single product as JSON by slug
    public function show($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        return response()->json($product);
    }

    // Optional: Return all products
    public function index()
    {
        return Cache::remember('product_list', 60, function () {
            return Product::select('id', 'name', 'slug', 'image')->get();
        });
    }

}
