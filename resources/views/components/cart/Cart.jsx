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
    const summaryRef = useRef(null);
    const emptyRef = useRef(null);

    useEffect(() => {
        axios.get('/cart/items')
            .then(res => {
                const items = res.data.map(item => ({
                    ...item,
                    selected: false,
                    price: parseFloat(item.price ?? 0)
                }));
                setCartItems(items);
            })
            .finally(() => setLoading(false));
    }, []);

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
            .then(() => {
                setCartItems(prev =>
                    prev.map(i =>
                        i.id === id ? { ...i, quantity: newQty } : i
                    )
                );
            });
    };

    const selectedItems = cartItems.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = selectedItems.length > 0 ? 100 : 0;
    const total = subtotal + shipping;

    // Animate Order Summary on scroll (not on selection)
    useEffect(() => {
        if (summaryRef.current) {
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
        }
    }, []);

    // Animate Empty Cart
    useEffect(() => {
        if (!loading && cartItems.length === 0 && emptyRef.current) {
            gsap.fromTo(emptyRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
            );
        }
    }, [loading, cartItems]);

    return (
        <div className="bg-[#0e0e0e] text-white min-h-screen">
            <div className="pt-40 px-6 md:px-16 pb-24 overflow-visible">
                <h2 className="text-yellow text-4xl md:text-5xl font-modern-negra tracking-widest mb-12 text-center">
                    Your Cart
                </h2>

                {loading ? (
                    <div className="text-center text-yellow text-xl">Loading your cart...</div>
                ) : cartItems.length === 0 ? (
                    <div
                        ref={emptyRef}
                        className="flex flex-col items-center justify-center gap-6 text-center py-24 text-yellow/90"
                    >
                        <div className="text-6xl sm:text-7xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 sm:w-28 sm:h-28 mx-auto text-yellow drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-4a2 2 0 11-4 0" />
                            </svg>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-modern-negra tracking-wide">Your Cart is Empty</h3>
                        <p className="max-w-md text-white/60 text-sm sm:text-base px-4">
                            Looks like you haven't added anything yet. Explore our collections and find something golden.
                        </p>
                        <a
                            href="/cocktails"
                            className="inline-block bg-yellow text-black px-6 py-3 rounded-full font-semibold tracking-wide hover:bg-white transition-all shadow-md"
                        >
                            Shop Now
                        </a>
                    </div>
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
                            selectedItems={selectedItems}
                        />
                    </div>
                )}
            </div>

            {/* Mobile Checkout Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-yellow/30 px-6 py-4 z-50">
                <div className="flex items-center justify-between">
                    <div className="text-white text-lg font-semibold">
                        Total: <span className="text-yellow">₱{total.toFixed(2)}</span>
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
