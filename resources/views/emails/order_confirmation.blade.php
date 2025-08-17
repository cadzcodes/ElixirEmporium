<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f9f9f9;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
        }

        h2 {
            color: #222;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #f4f4f4;
        }

        .total {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Order Confirmation</h2>
        <p>Hi {{ $user->name }},</p>
        <p>Thank you for your order! Here are your order details:</p>

        <h3>Order #{{ $order->id }}</h3>
        <p><strong>Payment Method:</strong> {{ ucfirst($order->payment_method) }}</p>
        <p><strong>Estimated Delivery:</strong> {{ $order->eta->format('F j, Y') }}</p>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $item)
                    <tr>
                        <td>{{ $item['name'] ?? 'Product #' . $item['product_id'] }}</td>
                        <td>{{ $item['quantity'] }}</td>
                        <td>₱{{ number_format($item['price'], 2) }}</td>
                        <td>₱{{ number_format($item['price'] * $item['quantity'], 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p><strong>Subtotal:</strong> ₱{{ number_format($order->subtotal, 2) }}</p>
        <p><strong>Shipping Fee:</strong> ₱{{ number_format($order->shipping_fee, 2) }}</p>
        <p class="total"><strong>Total:</strong> ₱{{ number_format($order->total, 2) }}</p>

        <p>If you have questions, just reply to this email.</p>
        <p>– The Elixir Emporium Team</p>
    </div>
</body>

</html>