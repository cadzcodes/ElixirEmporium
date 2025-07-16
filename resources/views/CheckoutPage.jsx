import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from "./components/Navbar";
import CheckoutForm from "./components/checkout/CheckoutForm";

const CheckoutPage = () => {
    return (
        <div className="bg-[#0e0e0e] text-white min-h-screen">
            <Navbar />
            <div className="pt-32 pb-24 px-4 md:px-16">
                <h2 className="text-yellow text-4xl md:text-5xl font-modern-negra tracking-widest mb-12 text-center">
                    Checkout
                </h2>
                <CheckoutForm />
            </div>
        </div>
    );
};

const rootElement = document.getElementById('checkoutPage');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<CheckoutPage />);
} else {
    console.error("No element with id 'checkoutPage' found.");
}