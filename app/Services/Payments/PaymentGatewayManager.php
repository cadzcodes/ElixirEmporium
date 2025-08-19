<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGatewayContract;
use App\Services\Payments\PaymongoGatewayService;
use App\Services\Payments\PayPalGatewayService;
use Exception;

class PaymentGatewayManager
{
    public function resolve(string $method): PaymentGatewayContract
    {
        return match ($method) {
            'gcash', 'paymaya' => new PaymongoGatewayService(),
            'paypal' => new PayPalGatewayService(),
            default => throw new Exception("Unsupported payment method: $method"),
        };
    }
}
