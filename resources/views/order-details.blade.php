<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../images/logo.png" type="image/svg+xml">
    <title>Order Details</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/views/OrderDetailsByID.jsx'])
</head>

<body>
    <div id="orderDetailsByID" data-order-id="{{ $orderId }}"></div>
</body>
<script>
    window.__USER__ = @json(Auth::user());
</script>

</html>