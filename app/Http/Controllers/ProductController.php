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
        // Get base URL from .env
        $baseUrl = env('PYTHON_API_BASE_URL', 'http://127.0.0.1:8000');

        // Make request to Python API
        $response = Http::get("{$baseUrl}/products/{$slug}");

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
        // Use the Docker service name "python-api" instead of 127.0.0.1
        $response = Http::get("http://python-api:8000/products");

        if ($response->failed()) {
            abort(500, 'Python API unavailable');
        }

        return $response->json();
    }


}
