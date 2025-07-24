import React, { forwardRef, useState } from 'react';

const OrderSummary = forwardRef(({ subtotal, shipping, total, hasSelection, selectedItems }, ref) => {
    const [loading, setLoading] = useState(false);

    const handleProceedToCheckout = async () => {
        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

        try {
            await fetch('/cart/checkout-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    items: selectedItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        name: item.name,
                        price: item.price,
                        image: item.image
                    })),
                }),
            });

            sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
            window.location.href = '/checkout';
        } catch (err) {
            console.error('Checkout failed:', err);
            alert('Something went wrong while proceeding to checkout.');
            setLoading(false); // allow retry
        }
    };

    return (
        <>
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#111] p-6 rounded-xl border border-yellow/30 shadow-2xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow mb-4"></div>
                        <p className="text-yellow font-semibold">Processing checkout...</p>
                    </div>
                </div>
            )}

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

                <button
                    onClick={handleProceedToCheckout}
                    disabled={!hasSelection || loading}
                    className={`mt-8 block text-center w-full py-3 text-lg font-semibold rounded-full transition-all duration-300 ${hasSelection && !loading
                        ? 'bg-yellow text-black hover:bg-white shadow-lg cursor-pointer'
                        : 'bg-gray-600 text-gray-400 pointer-events-none'
                        }`}
                >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
            </div>
        </>
    );
});

export default OrderSummary;
