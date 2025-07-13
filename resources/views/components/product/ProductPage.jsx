import React from 'react'

const ProductPage = () => {
  return (
    <section
      className="relative min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6 py-5 overflow-hidden"
      id="productPage"
    >
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center z-10">
        
        {/* Image Section — centered & spaced on mobile */}
        <div className="relative flex items-center justify-center w-full max-w-md aspect-square mx-auto mt-12 md:mt-0">

          {/* Radial Glow Behind */}
          <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-white/25 rounded-full blur-3xl animate-pulse-intense z-0" />

          {/* Product Image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl z-10">
            <img
              src="/images/mojito.png"
              alt="Luxury Elixir"
              className="object-contain w-full h-full transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold font-modern-negra text-yellow leading-tight">
            Golden Elixir
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Experience the timeless blend of rare botanicals and golden spirit. A luxurious craft designed for the discerning palate.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-white">$129.00</span>
            <span className="text-sm text-gray-400 line-through">$149.00</span>
          </div>

          <button className="bg-yellow text-black px-6 py-3 rounded-full font-semibold hover:bg-white transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2">
            Add to Cart
          </button>

          <ul className="text-sm text-gray-400 pt-4 space-y-1">
            <li>✔️ Free shipping worldwide</li>
            <li>✔️ Limited edition — 500 bottles only</li>
            <li>✔️ Ships in eco-luxury packaging</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
