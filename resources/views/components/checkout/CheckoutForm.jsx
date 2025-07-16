import React, { useState } from 'react';
import OrderDetails from './OrderDetails';
import ShippingDetails from './ShippingDetails';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';

const CheckoutForm = () => {
    const [shipping, setShipping] = useState({ name: '', address: '', contact: '' });
    const [payment, setPayment] = useState('Credit Card');

    const items = [
        { name: 'Golden Elixir Whiskey', quantity: 1, price: 129.99, image: '/images/mojito.png' },
        { name: 'Royal Noir Vodka', quantity: 2, price: 99.49, image: '/images/margarita.png' },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 15;
    const total = subtotal + shippingFee;

    const handlePlaceOrder = () => {
        alert('Order placed!');
    };

    return (
        <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-12">
                <OrderDetails items={items} />
                <ShippingDetails shipping={shipping} setShipping={setShipping} />
                <PaymentMethod payment={payment} setPayment={setPayment} />
            </div>

            {/* Right Side - Sticky Wrapper */}
            <div className="lg:col-span-1">
                <div className="sticky top-[100px]">
                    <OrderSummary
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        total={total}
                        onPlaceOrder={handlePlaceOrder}
                    />
                </div>
            </div>
        </div>
    );

};

export default CheckoutForm;
