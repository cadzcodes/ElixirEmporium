<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductController extends Controller
{
    // Return a single product as JSON by slug
    public function show($slug)
    {
        $response = Http::get("http://127.0.0.1:8000/products/{$slug}");

        if ($response->status() === 404) {
            throw new NotFoundHttpException('Product not found');
        }

        if ($response->failed()) {
            abort(500, 'Python API unavailable');
        }

        return response()->json($response->json());
    }
    public function index()
    {
        $response = Http::get("http://127.0.0.1:8000/products");

        if ($response->failed()) {
            abort(500, 'Python API unavailable');
        }

        return $response->json();
    }

}
