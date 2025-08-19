import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import { CheckCircle } from 'lucide-react';
import { BrowserRouter } from 'react-router-dom';
import SmoothFollower from "../components/Cursor";

const OrderConfirmation = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        fetch(`/orders/${orderId}`)
            .then(res => res.json())
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                navigate('/');
            });
    }, [orderId]);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(
                wrapperRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
            );
        }
    }, [loading]);

    if (loading) return <div className="text-yellow text-center mt-20">Loading your order...</div>;

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center p-6">
            <SmoothFollower />
            <div
                ref={wrapperRef}
                className="max-w-3xl w-full bg-[#1a1a1a] rounded-3xl p-10 shadow-2xl border border-yellow/20"
            >
                <div className="flex items-center gap-4 mb-6">
                    <CheckCircle className="text-yellow w-10 h-10" />
                    <h2 className="text-3xl font-bold text-yellow">Order Confirmed!</h2>
                </div>

                <p className="text-lg mb-6 text-white/80">
                    Thank you for shopping with <span className="text-yellow font-semibold">Elixir Emporium</span>.
                    Your order has been successfully placed.
                </p>

                <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-yellow mb-3">Order Summary</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-white/80">
                        <p>Order ID:</p>
                        <p className="text-white font-medium">#{order.id}</p>

                        <p>Status:</p>
                        <p className="capitalize">{order.status}</p>

                        <p>Payment Method:</p>
                        <p>{order.payment_method}</p>

                        <p>Shipping Fee:</p>
                        <p>₱{Number(order.shipping_fee).toFixed(2)}</p>


                        <p>Total:</p>
                        <p className="text-yellow font-bold">₱{Number(order.total).toFixed(2)}</p>


                        <p>ETA:</p>
                        <p>{new Date(order.eta).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <h3 className="text-xl font-semibold text-yellow">Items:</h3>
                    {order.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between border-b border-white/10 py-3"
                        >
                            <div>
                                <p className="font-medium text-white">{item.product_name}</p>
                                <p className="text-sm text-white/50">x{item.quantity}</p>
                            </div>
                            <p className="font-semibold text-yellow">₱{Number(item.subtotal).toFixed(2)}</p>

                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => window.location.href = '/account?tab=orders'}
                        className="px-6 py-3 bg-yellow/20 border border-yellow text-yellow font-semibold rounded-xl hover:bg-yellow/30 transition duration-300"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-yellow text-black font-semibold rounded-xl hover:bg-yellow/90 transition duration-300"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};


const rootElement = document.getElementById('orderConfirmationPage');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <BrowserRouter>
            <OrderConfirmation />
        </BrowserRouter>
    );
} else {
    console.error("No element with id 'orderConfirmationPage' found.");
}