import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductTable from './ProductTable';
import OrderSummary from './OrderSummary';

gsap.registerPlugin(ScrollTrigger);

const fakeCartItems = [
    {
        id: 1,
        name: 'Golden Elixir Whiskey',
        subtitle: '750ml · Premium Blend',
        price: 129.99,
        quantity: 1,
        image: '/images/mojito.png',
    },
    {
        id: 2,
        name: 'Royal Noir Vodka',
        subtitle: '700ml · Ultra Smooth',
        price: 99.49,
        quantity: 2,
        image: '/images/margarita.png',
    },
    {
        id: 3,
        name: 'Scarlet Cherry Brandy',
        subtitle: '500ml · Sweet & Bold',
        price: 89.99,
        quantity: 2,
        image: '/images/margarita.png',
    },
    {
        id: 4,
        name: 'Amber Gold Rum',
        subtitle: '750ml · Barrel Aged',
        price: 105.25,
        quantity: 1,
        image: '/images/margarita.png',
    },
    {
        id: 5,
        name: 'Midnight Sapphire Gin',
        subtitle: '700ml · Botanical Fusion',
        price: 94.75,
        quantity: 1,
        image: '/images/margarita.png',
    },
    {
        id: 6,
        name: 'Crimson Spice Tequila',
        subtitle: '750ml · Extra Añejo',
        price: 112.00,
        quantity: 1,
        image: '/images/margarita.png',
    },
    {
        id: 7,
        name: 'Royal Noir Vodka',
        subtitle: '700ml · Ultra Smooth',
        price: 99.49,
        quantity: 2,
        image: '/images/margarita.png',
    },
];

const Cart = () => {
    const [cartItems, setCartItems] = useState(
        fakeCartItems.map(item => ({ ...item, selected: false }))
    );
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
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Product Table */}
                    <ProductTable
                        cartItems={cartItems}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                        onDelete={handleDelete}
                        onQuantityChange={handleQuantityChange}
                    />

                    {/* Sticky Order Summary */}
                    <OrderSummary
                        ref={summaryRef}
                        subtotal={subtotal}
                        shipping={shipping}
                        total={total}
                        hasSelection={selectedItems.length > 0}
                    />
                </div>
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
