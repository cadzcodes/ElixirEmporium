import React, { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import AlertDialog from '../reusables/AlertDialog'

const ProductPage = () => {
  const product = window.__PRODUCT__
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [alerts, setAlerts] = useState([])
  const qtyRef = useRef(null)
  const isOutOfStock = product.availability !== 'in-stock';

  useEffect(() => {
    if (qtyRef.current) {
      gsap.fromTo(
        qtyRef.current,
        { scale: 0.9, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      )
    }
  }, [quantity])

  const handleAddToCart = async () => {
    if (!window.__USER__) {
      window.location.href = '/login'
      return
    }

    try {
      setAdding(true)
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const res = await fetch('/cart/items', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      })

      const id = Date.now()

      if (res.ok) {
        setAlerts(prev => [...prev, { id, type: 'success', message: 'Added to cart!' }])
      } else {
        const data = await res.json()
        setAlerts(prev => [...prev, { id, type: 'error', message: data.message || 'Failed to add' }])
      }
    } catch (error) {
      console.error('Add to cart failed:', error)
      const id = Date.now()
      setAlerts(prev => [...prev, { id, type: 'error', message: 'Error adding to cart' }])
    } finally {
      setAdding(false)
    }
  }

  const increment = () => setQuantity(prev => prev + 1)
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  const handleManualChange = (e) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val > 0) setQuantity(val)
  }

  return (
    <section className="relative min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6 py-5 overflow-hidden" id="productPage">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center z-10">
        {/* Image */}
        <div className="relative flex items-center justify-center w-full max-w-md aspect-square mx-auto mt-12 md:mt-0">
          <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-white/25 rounded-full blur-3xl animate-pulse-intense z-0" />
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl z-10">
            <img
              src={`http://elixirbar.test//${product.image}`}
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-modern-negra text-yellow leading-tight">{product.name}</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-white">₱{product.price}</span>
            {product.sale_price && (
              <span className="text-sm text-gray-400 line-through">₱{product.sale_price}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white">Quantity:</span>
            <div className="flex items-center border border-gray-400 rounded-full overflow-hidden bg-black/40">
              <button
                onClick={decrement}
                disabled={isOutOfStock}
                className={`w-8 h-8 text-lg flex items-center justify-center transition ${isOutOfStock ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-yellow hover:text-black'
                  }`}
              >
                -
              </button>
              <input
                ref={qtyRef}
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={handleManualChange}
                disabled={isOutOfStock}
                className="w-12 text-center text-white bg-transparent outline-none disabled:cursor-not-allowed"
              />
              <button
                onClick={increment}
                disabled={isOutOfStock}
                className={`w-8 h-8 text-lg flex items-center justify-center transition ${isOutOfStock ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-yellow hover:text-black'
                  }`}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
            className={`cursor-pointer px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOutOfStock
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-yellow text-black hover:bg-white hover:shadow-lg focus:ring-yellow'
              }`}
          >
            {isOutOfStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
          </button>

          <ul className="text-sm text-gray-400 pt-4 space-y-1">
            <li>✔️ Free shipping worldwide</li>
            <li>✔️ Limited edition — 500 bottles only</li>
            <li>✔️ Ships in eco-luxury packaging</li>
          </ul>
        </div>
      </div>

      {/* Alerts */}
      <div className="fixed top-4 right-4 space-y-3 z-[1000]">
        {alerts.map(alert => (
          <AlertDialog
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => {
              setAlerts(prev => prev.filter(a => a.id !== alert.id))
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductPage
