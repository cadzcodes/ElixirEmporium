import React, { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails';
import ShippingDetails from './ShippingDetails';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';

const CheckoutForm = () => {
    const [shipping, setShipping] = useState(null);
    const [loadingAddress, setLoadingAddress] = useState(true);
    const [payment, setPayment] = useState('Credit Card');
    const [items, setItems] = useState([]);

    // Fetch cart items from sessionStorage
    useEffect(() => {
        const stored = sessionStorage.getItem('checkoutItems');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setItems(parsed);
            } catch (err) {
                console.error('Invalid checkoutItems format in sessionStorage:', err);
            }
        }
    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem('checkoutItems');
        if (!stored) {
            window.location.href = '/cart'; // Redirect if no checkout items
        }
    }, []);

    // Fetch default shipping address
    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const tokenElement = document.querySelector('meta[name="csrf-token"]');
                if (!tokenElement) throw new Error('CSRF token not found');
                const csrfToken = tokenElement.getAttribute('content');

                const res = await fetch('/addresses', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    credentials: 'include',
                });

                const data = await res.json();
                const defaultAddr = data.find(addr => addr.is_default);

                if (defaultAddr) {
                    setShipping({
                        id: defaultAddr.id,
                        name: defaultAddr.full_name,
                        phone: defaultAddr.phone,
                        address1: defaultAddr.address,
                        address2: [defaultAddr.unit_number, defaultAddr.barangay, defaultAddr.city, defaultAddr.province].filter(Boolean).join(', '),
                        type: defaultAddr.type,
                    });
                }
            } catch (err) {
                console.error('Failed to fetch default address:', err);
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchDefaultAddress();
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = items.length > 0 ? 100 : 0;
    const total = subtotal + shippingFee;

    const handlePlaceOrder = async () => {
        try {
            const tokenElement = document.querySelector('meta[name="csrf-token"]');
            if (!tokenElement) throw new Error('CSRF token not found');
            const csrfToken = tokenElement.getAttribute('content');

            const response = await fetch('/orders/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    items,
                    shipping_id: shipping.id,
                    payment_method: payment,
                }),
            });

            const result = await response.json();
            console.log("Sending items to backend:", items);
            
            if (response.ok) {
                sessionStorage.removeItem('checkoutItems');
                window.location.href = `/order-confirmation?order_id=${result.order_id}`;
            } else {
                console.error(result);
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Order placement error:', err);
            alert('Error placing order. See console for details.');
        }
    };


    return (
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <ShippingDetails
                    shipping={shipping}
                    loading={loadingAddress}
                    onChange={(updated) => setShipping(updated)}
                />
                <OrderDetails items={items} />
                <PaymentMethod payment={payment} setPayment={setPayment} />
            </div>

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
