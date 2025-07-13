import React from 'react'
import { FaLeaf, FaGlobe, FaFlask } from 'react-icons/fa'

const highlights = [
  {
    title: 'Botanical Perfection',
    description: 'Crafted with handpicked herbs and citrus infusions sourced from sustainable farms.',
    icon: <FaLeaf className="text-yellow text-3xl" />
  },
  {
    title: 'Globally Celebrated',
    description: 'Recognized in 15 countries as a premium spirit for connoisseurs and collectors.',
    icon: <FaGlobe className="text-yellow text-3xl" />
  },
  {
    title: 'Refined Alchemy',
    description: 'Small-batch distillation process ensures a smooth, rich, and balanced taste.',
    icon: <FaFlask className="text-yellow text-3xl" />
  }
]

const ProductHighlights = () => {
  return (
    <section className="bg-[#141414] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto text-center space-y-12">
        <h2 className="text-3xl md:text-4xl font-modern-negra text-yellow">Crafted Excellence</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 hover:bg-white/10"
            >
              <div className="flex flex-col items-center gap-4">
                {item.icon}
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductHighlights
