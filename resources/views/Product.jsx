import React from 'react'
import ReactDOM from 'react-dom/client';
import ProductPage from "./components/product/ProductPage";
import Navbar from "./components/Navbar";
import ProductHighlights from "./components/product/ProductHighlights";
import ProductCraft from "./components/product/ProductCraft";

const Product = () => {
    return (
        <div>
            <Navbar />
            <ProductPage />
            <ProductHighlights />
            <ProductCraft />
        </div>

    )
}

const rootElement = document.getElementById('product');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<Product />);
} else {
    console.error("No element with id 'product' found.");
}
