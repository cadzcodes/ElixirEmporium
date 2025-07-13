import React from 'react'

const ingredients = [
  { name: '24K Gold Flakes', description: 'Real edible gold for visual brilliance & opulence.' },
  { name: 'Aged Botanical Extracts', description: 'Handpicked botanicals matured to perfection.' },
  { name: 'Crystal Spring Water', description: 'Drawn from pristine underground aquifers.' },
  { name: 'Barrel-Aged Spirit', description: 'Refined in French oak barrels for deep aroma.' },
]

const ProductCraft = () => {
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <div>
          <h2 className="text-yellow text-4xl md:text-5xl font-modern-negra mb-4">
            Crafted to Perfection
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every bottle of <span className="text-white font-semibold">Golden Elixir</span> is a masterpiece of precision and luxury, made with ingredients sourced from around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition"
            >
              <h3 className="text-xl text-yellow font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductCraft
