import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import OrderDetailsPage from '../components/order-details/OrderDetailsPage';
import SmoothFollower from '../components/Cursor';
import Navbar from "../components/Navbar";

const OrderDetailsByID = () => {
    const [order, setOrder] = useState(null);
    const orderId = document.getElementById('orderDetailsByID').dataset.orderId;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/orders/${orderId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                const transformed = {
                    id: `ORD-${String(data.id).padStart(9, '0')}`,
                    status: data.status,
                    order_date: data.created_at || new Date().toISOString(),
                    eta: data.eta,
                    payment_method: data.payment_method,
                    shipping_fee: parseFloat(data.shipping_fee),
                    total: parseFloat(data.total),
                    shipping: {
                        name: data.shipping?.name ?? 'N/A',
                        phone: data.shipping?.phone ?? 'N/A',
                        address1: data.shipping?.address1 ?? '',
                        address2: data.shipping?.address2 ?? '',
                        type: data.shipping?.type ?? 'home',
                    },
                    items: data.items.map(item => ({
                        name: item.product_name,
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.unit_price),
                        image: item.image ? `/${item.image}` : '/images/default.png',
                    })),
                };


                setOrder(transformed);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            }
        };


        fetchOrder();
    }, [orderId]);

    return (
        <div>
            <SmoothFollower />
            <Navbar />
            <OrderDetailsPage order={order} />
        </div>
    );
};

const rootElement = document.getElementById('orderDetailsByID');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<OrderDetailsByID />);
}
