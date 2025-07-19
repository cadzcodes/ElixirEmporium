import React from 'react';

const ProductPage = () => {
  const product = window.__PRODUCT__;

  return (
    <section className="relative min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6 py-5 overflow-hidden" id="productPage">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center z-10">

        <div className="relative flex items-center justify-center w-full max-w-md aspect-square mx-auto mt-12 md:mt-0">
          <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-white/25 rounded-full blur-3xl animate-pulse-intense z-0" />
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl z-10">
            <img
              src={`/storage/${product.image}`}
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-modern-negra text-yellow leading-tight">
            {product.name}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-white">${product.price}</span>
            {product.sale_price && (
              <span className="text-sm text-gray-400 line-through">${product.sale_price}</span>
            )}
          </div>

          <a
            href="/cart"
            className="cursor-pointer bg-yellow text-black px-6 py-3 rounded-full font-semibold hover:bg-white transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2 text-center inline-block"
          >
            Add to Cart
          </a>

          <ul className="text-sm text-gray-400 pt-4 space-y-1">
            <li>✔️ Free shipping worldwide</li>
            <li>✔️ Limited edition — 500 bottles only</li>
            <li>✔️ Ships in eco-luxury packaging</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
