<?php
namespace App\Services\Payments;

use App\Contracts\PaymentGatewayContract;
use Illuminate\Support\Facades\Http;

class PayPalGatewayService implements PaymentGatewayContract
{
    private function getAccessToken()
    {
        $auth = Http::asForm()->withBasicAuth(
            env('PAYPAL_CLIENT_ID'),
            env('PAYPAL_SECRET')
        )->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ])->json();

        return $auth['access_token'] ?? null;
    }

    public function createCheckout($order, $total)
    {
        $accessToken = $this->getAccessToken();

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
                    'return_url' => route('payment.success', ['order' => $order->id]),
                    'cancel_url' => route('payment.cancel', ['order' => $order->id]),
                ]
            ])->json();

        return collect($paypalOrder['links'] ?? [])->firstWhere('rel', 'approve')['href'] ?? null;
    }

    public function handleSuccess($request, $orderId)
    {
        $paypalOrderId = $request->query('token');
        $accessToken = $this->getAccessToken();

        Http::withToken($accessToken)
            ->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/{$paypalOrderId}/capture");

        return true;
    }
}
