import React from 'react'
import ReactDOM from 'react-dom/client';
import Cart from "./components/cart/Cart";
import Navbar from "./components/Navbar";
import SmoothFollower from "./components/Cursor";

const CartPage = () => {
    return (
        <div>
            <SmoothFollower />
            <Navbar />
            <Cart />
        </div>
    )
}


const rootElement = document.getElementById('cart');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<CartPage />);
} else {
    console.error("No element with id 'cart' found.");
}