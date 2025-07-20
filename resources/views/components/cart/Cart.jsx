import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductTable from './ProductTable';
import OrderSummary from './OrderSummary';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const Cart = () => {

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get('/cart/items')
            .then(res => {
                const items = res.data.map(item => ({ ...item, selected: false, price: parseFloat(item.price ?? 0) }));
                setCartItems(items);
            })
            .finally(() => setLoading(false));
    }, []);
    const summaryRef = useRef(null);

    const handleSelect = id => {
        const updatedItems = cartItems.map(item => {
            if (item.id === id) {
                if (!item.selected) {
                    const el = document.getElementById(`cart-item-${id}`);
                    gsap.fromTo(
                        el,
                        { scale: 0.95, opacity: 0.8 },
                        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
                    );
                }
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    const handleSelectAll = () => {
        const allSelected = cartItems.every(item => item.selected);
        setCartItems(cartItems.map(item => ({ ...item, selected: !allSelected })));
    };

    const handleDelete = id => {
        axios.delete(`/cart/items/${id}`)
            .then(() => {
                setCartItems(prev => prev.filter(i => i.id !== id));
            });
    };

    const handleQuantityChange = (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        const newQty = Math.max(1, item.quantity + delta);

        axios.put(`/cart/items/${id}`, { quantity: newQty })
            .then(res => {
                setCartItems(prev =>
                    prev.map(i =>
                        i.id === id ? { ...i, quantity: newQty } : i
                    )
                );
            });
    };

    const selectedItems = cartItems.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = selectedItems.length > 0 ? 15 : 0;
    const total = subtotal + shipping;

    useEffect(() => {
        gsap.from(summaryRef.current, {
            opacity: 0,
            x: 100,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: summaryRef.current,
                start: 'top 90%',
            },
        });
    }, []);

    return (
        <div className="bg-[#0e0e0e] text-white min-h-screen">
            <div className="pt-40 px-6 md:px-16 pb-24 overflow-visible">
                <h2 className="text-yellow text-4xl md:text-5xl font-modern-negra tracking-widest mb-12 text-center">
                    Your Cart
                </h2>

                {loading ? (
                    <div className="text-center text-yellow text-xl">Loading your cart...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <ProductTable
                            cartItems={cartItems}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            onDelete={handleDelete}
                            onQuantityChange={handleQuantityChange}
                        />
                        <OrderSummary
                            ref={summaryRef}
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                            hasSelection={selectedItems.length > 0}
                        />
                    </div>
                )}

            </div>

            {/* Mobile Checkout Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-yellow/30 px-6 py-4 z-50">
                <div className="flex items-center justify-between">
                    <div className="text-white text-lg font-semibold">
                        Total: <span className="text-yellow">${total.toFixed(2)}</span>
                    </div>
                    <button
                        disabled={selectedItems.length === 0}
                        className={`ml-4 px-6 py-2 text-sm font-bold rounded-full transition-all duration-300 ${selectedItems.length
                            ? 'bg-yellow text-black hover:bg-white shadow-lg'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
