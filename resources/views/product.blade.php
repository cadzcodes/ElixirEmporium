<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>{{ $product->name }} - Elixir Emporium</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/views/react-pages/Product.jsx'])
</head>
<body>
    <div id="product"></div>

    <script>
        window.__PRODUCT__ = @json($product);
        window.__USER__ = @json(Auth::user());
    </script>
</body>
</html>
