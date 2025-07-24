import React, { forwardRef } from 'react';

const OrderSummary = forwardRef(({ subtotal, shipping, total, hasSelection }, ref) => {
    return (
        <div
            ref={ref}
            className="hidden lg:block sticky top-[120px] bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-yellow/30 h-fit"
        >

            <h3 className="text-2xl font-semibold text-yellow mb-6 border-b border-yellow/20 pb-4">
                Order Summary
            </h3>
            <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₱{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-lg border-t border-yellow/20 pt-4">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>

            <a
                href="/checkout"
                className={`mt-8 block text-center w-full py-3 text-lg font-semibold rounded-full transition-all duration-300 ${hasSelection
                    ? 'bg-yellow text-black hover:bg-white shadow-lg'
                    : 'bg-gray-600 text-gray-400 pointer-events-none'
                    }`}
            >
                Proceed to Checkout
            </a>
        </div>
    );
});

export default OrderSummary;
