<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductController extends Controller
{
    protected $apiBase;

    public function __construct()
    {
        $this->apiBase = config('services.python_api.base_url'); // fetch from .env via config
    }

    // Return a single product as JSON by slug
    public function show($slug)
    {
        $response = Http::get("{$this->apiBase}/products/{$slug}");

        if ($response->status() === 404) {
            throw new NotFoundHttpException('Product not found');
        }

        if ($response->failed()) {
            abort(500, 'Python API unavailable');
        }

        return response()->json($response->json());
    }

    // Return all products
    public function index()
    {
        $response = Http::get("{$this->apiBase}/products");

        if ($response->failed()) {
            abort(500, 'Python API unavailable');
        }

        return $response->json();
    }
}
