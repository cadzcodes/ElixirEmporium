<?php

namespace Database\Seeders;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Mojito',
                'image' => 'images/mojito.png',
                'price' => 129.00,
                'sale_price' => 149.00,
                'description' => 'A crisp, minty classic with Caribbean rum and lime zest.',
            ],
            [
                'name' => 'Margarita',
                'image' => 'images/margarita.png',
                'price' => 119.00,
                'sale_price' => 139.00,
                'description' => 'A tangy twist of tequila, lime, and salt — timeless refreshment.',
            ],
            [
                'name' => 'Old Fashioned',
                'image' => 'images/oldfashion.png',
                'price' => 139.00,
                'sale_price' => 149.00,
                'description' => 'Classic bourbon blend with bitters, sugar, and a citrus twist.',
            ],
            [
                'name' => 'Cosmopolitan',
                'image' => 'images/cosmopolitan.png',
                'price' => 129.00,
                'sale_price' => 0,
                'description' => 'Sleek and pink — vodka, cranberry, triple sec, lime elegance.',
            ],
            [
                'name' => 'Negroni',
                'image' => 'images/negroni.png',
                'price' => 149.00,
                'sale_price' => 0,
                'description' => 'Bold bittersweet depth — gin, vermouth, and Campari soul.',
            ],
            [
                'name' => 'Whiskey Sour',
                'image' => 'images/whiskeysour.png',
                'price' => 135.00,
                'sale_price' => 0,
                'description' => 'Smooth whiskey meets lemon tartness with a cherry whisper.',
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'image' => $product['image'],
                'price' => $product['price'],
                'sale_price' => $product['sale_price'] ?: null,
                'description' => $product['description'],
            ]);
        }
    }
}
