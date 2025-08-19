<?php
namespace App\Contracts;

interface PaymentGatewayContract
{
    public function createCheckout($order, $total);
    public function handleSuccess($request, $orderId);
}