import React from 'react'

const OrderSummary = ({ subtotal, shippingFee, total, onPlaceOrder }) => {
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

            <button
                onClick={onPlaceOrder}
                className="mt-8 w-full py-3 text-lg font-semibold rounded-full bg-yellow text-black hover:bg-white shadow-lg transition-all duration-300"
            >
                Place Order
            </button>
        </div>
    );
};

export default OrderSummary;
