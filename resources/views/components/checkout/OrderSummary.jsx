import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const OrderSummary = ({ subtotal, shippingFee, total, onPlaceOrder, shake, hasShipping }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!dialogRef.current) return;

        if (shake) {
            gsap.to(dialogRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                display: 'block',
                ease: 'power2.out'
            });
        } else if (hasShipping) {
            gsap.to(dialogRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    if (dialogRef.current) {
                        dialogRef.current.style.display = 'none';
                    }
                }
            });
        }
    }, [shake, hasShipping]);

    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow/30 shadow-2xl h-fit sticky top-[100px]">
            <h3 className="text-2xl font-semibold text-yellow mb-6 border-b border-yellow/20 pb-4">
                Summary
            </h3>

            <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₱{shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-lg border-t border-yellow/20 pt-4">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>

            <div className={shake ? "animate-shake" : ""}>
                <button
                    onClick={onPlaceOrder}
                    className="mt-8 w-full py-3 text-lg font-semibold rounded-full bg-yellow text-black hover:bg-white shadow-lg transition-all duration-300"
                >
                    Place Order
                </button>
            </div>

            <div
                ref={dialogRef}
                className="mt-4 w-full text-sm text-yellow-300 bg-[#2e2e2e] border border-yellow-500 px-4 py-3 rounded-xl shadow-xl"
                style={{ opacity: 0, display: 'none', position: 'relative' }}
            >
                🛑 Oops! You forgot to add a shipping address. We can’t teleport your goodies yet!
            </div>
        </div>
    );
};

export default OrderSummary;
