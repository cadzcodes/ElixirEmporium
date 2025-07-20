<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>Cart - Elixir Emporium</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/views/CartPage.jsx'])
</head>

<body>
    <div id="cart"></div>
</body>

<script>
    window.__USER__ = @json(Auth::user());
</script>

</html>