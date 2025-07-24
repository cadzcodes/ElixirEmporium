<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>Checkout - Elixir Emporium</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/views/checkoutPage.jsx'])
</head>

<body>
    <div id="checkoutPage"></div>
</body>

<script>
    window.__USER__ = @json(Auth::user());
    window.checkoutItems = @json(session('checkoutItems'));
</script>

</html>