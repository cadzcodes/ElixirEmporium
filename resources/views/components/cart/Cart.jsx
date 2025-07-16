import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
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
            <div className="pt-40 px-6 md:px-16 pb-24">
                <h2 className="text-yellow text-4xl md:text-5xl font-modern-negra tracking-widest mb-12 text-center">
                    Your Cart
                </h2>

                <div className="relative">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Cart Items Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header Row (Desktop only) */}
                            {cartItems.length > 0 && (
                                <div className="hidden md:grid grid-cols-12 p-6 rounded-2xl border border-yellow/20 text-gray-400 font-semibold text-sm mb-4 shadow-md backdrop-blur bg-gradient-to-r from-[#1a1a1a]/80 via-[#191919]/80 to-[#1a1a1a]/80">
                                    <div className="col-span-5 flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 accent-yellow cursor-pointer"
                                            checked={cartItems.every(item => item.selected)}
                                            onChange={handleSelectAll}
                                        />
                                        <span>Product</span>
                                    </div>
                                    <div className="col-span-2 text-center">Unit Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-center">Total Price</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>
                            )}

                            {/* Cart Items */}
                            {cartItems.map(item => (
                                <div
                                    key={item.id}
                                    id={`cart-item-${item.id}`}
                                    onClick={() => handleSelect(item.id)}
                                    className={`cursor-pointer grid grid-cols-12 items-center gap-4 bg-[#1a1a1a] p-7 rounded-2xl shadow-xl border border-yellow/20 transition-all duration-300 hover:bg-[#1f1f1f] ${item.selected ? 'ring-2 ring-yellow' : ''
                                        }`}
                                >
                                    <div className="col-span-5 flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => handleSelect(item.id)}
                                            onClick={e => e.stopPropagation()}
                                            className="form-checkbox h-5 w-5 accent-yellow cursor-pointer"
                                        />
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-contain rounded-md border border-yellow/10"
                                            onClick={e => e.stopPropagation()}
                                        />
                                        <div>
                                            <h3 className="text-xl font-semibold text-yellow">{item.name}</h3>
                                            <p className="text-sm italic text-gray-500">{item.subtitle}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center text-white text-lg">
                                        ${item.price.toFixed(2)}
                                    </div>

                                    <div className="col-span-2 flex justify-center items-center gap-3">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleQuantityChange(item.id, -1);
                                            }}
                                            className="size-10 aspect-square flex items-center justify-center bg-[#2a2a2a] rounded-full hover:bg-yellow hover:text-black hover:scale-105 transition-transform duration-150 text-lg"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg">{item.quantity}</span>
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleQuantityChange(item.id, 1);
                                            }}
                                            className="size-10 aspect-square flex items-center justify-center bg-[#2a2a2a] rounded-full hover:bg-yellow hover:text-black hover:scale-105 transition-transform duration-150 text-lg"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="col-span-2 text-center text-white font-bold text-lg">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>

                                    <div className="col-span-1 text-right">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            className="text-sm text-red-400 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Order Summary Column */}
                        <div
                            ref={summaryRef}
                            className="hidden lg:block sticky top-[90px] bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-yellow/30 h-fit">
                            <h3 className="text-2xl font-semibold text-yellow mb-6 border-b border-yellow/20 pb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-4 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-white text-lg border-t border-yellow/20 pt-4">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                disabled={selectedItems.length === 0}
                                className={`mt-8 w-full py-3 text-lg font-semibold rounded-full transition-all duration-300 ${selectedItems.length
                                    ? 'bg-yellow text-black hover:bg-white shadow-lg'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
