<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGatewayContract;
use Illuminate\Support\Facades\Http;

class PaymongoGatewayService implements PaymentGatewayContract
{
    public function createCheckout($order, $total)
    {
        $session = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'line_items' => [
                            [
                                'name' => 'Order #' . $order->id,
                                'amount' => intval($total * 100),
                                'currency' => 'PHP',
                                'quantity' => 1,
                            ]
                        ],
                        'payment_method_types' => [$order->payment_method],
                        'success_url' => route('payment.success', ['order' => $order->id]),
                        'cancel_url' => route('payment.cancel', ['order' => $order->id]),
                    ]
                ]
            ])->json();

        return $session['data']['attributes']['checkout_url'] ?? null;
    }

    public function handleSuccess($request, $orderId)
    {
        // PayMongo handles via webhook
        return true;
    }
}
