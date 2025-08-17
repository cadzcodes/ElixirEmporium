<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\CartItem;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\Address;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{

    public function place(Request $request)
    {
        $user = Auth::user();

        $items = $request->input('items');
        $shippingId = $request->input('shipping_id');
        $paymentMethod = $request->input('payment_method');

        $subtotal = collect($items)->sum(fn($item) => $item['price'] * $item['quantity']);
        $shippingFee = 100;
        $total = $subtotal + $shippingFee;

        // 1️⃣ Create order in DB
        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $shippingId,
            'payment_method' => $paymentMethod,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $total,
            'status' => 'pending', // so it's updated after payment
            'eta' => now()->addDays(3),
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['price'],
                'subtotal' => $item['price'] * $item['quantity'],
            ]);
        }

        Mail::send('emails.order_confirmation', [
            'user' => $user,
            'order' => $order,
            'items' => $items
        ], function ($mail) use ($user, $order) {
            $mail->to($user->email, $user->name)
                ->subject('Order Confirmation - Order #' . $order->id);
        });

        // Remove from cart
        $orderedProductIds = collect($items)->pluck('product_id')->toArray();
        CartItem::where('user_id', $user->id)
            ->whereIn('product_id', $orderedProductIds)
            ->delete();

        // 2️⃣ If payment is GCash or Maya, create PayMongo checkout session
        if (in_array($paymentMethod, ['gcash', 'paymaya'])) {
            $session = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'line_items' => [
                                [
                                    'name' => 'Order #' . $order->id,
                                    'amount' => intval($total * 100), // centavos
                                    'currency' => 'PHP',
                                    'quantity' => 1,
                                ]
                            ],
                            'payment_method_types' => [$paymentMethod],
                            'success_url' => route('payment.success', ['order' => $order->id]),
                            'cancel_url' => route('payment.cancel', ['order' => $order->id]),
                        ]
                    ]
                ])->json();

            if (isset($session['data']['attributes']['checkout_url'])) {
                return response()->json([
                    'redirect_url' => $session['data']['attributes']['checkout_url']
                ]);
            }

            return response()->json(['error' => 'Failed to create PayMongo session'], 500);
        }

        if ($paymentMethod === 'paypal') {
            // 1️⃣ Get access token
            $auth = Http::asForm()->withBasicAuth(
                env('PAYPAL_CLIENT_ID'),
                env('PAYPAL_SECRET')
            )->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                        'grant_type' => 'client_credentials'
                    ])->json();

            $accessToken = $auth['access_token'] ?? null;

            if (!$accessToken) {
                return response()->json(['error' => 'Failed to authenticate with PayPal'], 500);
            }

            // 2️⃣ Create PayPal order
            $paypalOrder = Http::withToken($accessToken)
                ->post('https://api-m.sandbox.paypal.com/v2/checkout/orders', [
                    'intent' => 'CAPTURE',
                    'purchase_units' => [
                        [
                            'reference_id' => $order->id,
                            'amount' => [
                                'currency_code' => 'PHP',
                                'value' => number_format($total, 2, '.', '')
                            ]
                        ]
                    ],
                    'application_context' => [
                        'brand_name' => 'My Store',
                        'landing_page' => 'LOGIN',
                        'user_action' => 'PAY_NOW',
                        'return_url' => route('payment.success', ['order' => $order->id]),
                        'cancel_url' => route('payment.cancel', ['order' => $order->id]),
                    ]
                ])->json();

            // 3️⃣ Return approval link to frontend
            if (!empty($paypalOrder['links'])) {
                $approveLink = collect($paypalOrder['links'])
                    ->firstWhere('rel', 'approve')['href'] ?? null;

                if ($approveLink) {
                    return response()->json([
                        'redirect_url' => $approveLink
                    ]);
                }
            }

            return response()->json(['error' => 'Failed to create PayPal order'], 500);
        }

        // 3️⃣ Otherwise, proceed as normal (e.g., COD)
        return response()->json([
            'message' => 'Order placed',
            'order_id' => $order->id
        ]);
    }


    public function paypalSuccess(Request $request, $orderId)
    {
        $paypalOrderId = $request->query('token'); // PayPal sends ?token=EC-xxxx

        // 1️⃣ Get access token again
        $auth = Http::asForm()->withBasicAuth(
            env('PAYPAL_CLIENT_ID'),
            env('PAYPAL_SECRET')
        )->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ])->json();

        $accessToken = $auth['access_token'] ?? null;

        // 2️⃣ Capture payment
        $capture = Http::withToken($accessToken)
            ->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/{$paypalOrderId}/capture")
            ->json();

        // 3️⃣ Update order status
        $order = Order::findOrFail($orderId);
        $order->status = 'Order Placed';
        $order->save();

        return redirect()->to("/order-confirmation?order_id={$order->id}");
    }



    public function show(Request $request, $id)
    {
        // The base URL of your Python API
        $apiBase = config('services.python_api.base_url', 'http://127.0.0.1:8000');

        // Call the FastAPI endpoint, sending the user ID from the authenticated user
        $response = Http::withHeaders([
            'X-User-ID' => $request->user()->id,
        ])->get("{$apiBase}/orders/{$id}");

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch order details',
                'error' => $response->json(),
            ], $response->status());
        }

        return response()->json($response->json());
    }

    public function getMyOrders()
    {
        $user = Auth::user();
        $apiBase = config('services.python_api.base_url', 'http://127.0.0.1:8000');

        $response = Http::get("{$apiBase}/orders/user/{$user->id}");

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch orders',
                'error' => $response->json(),
            ], $response->status());
        }

        return response()->json($response->json());
    }

}
