import React from 'react'

const images = [
    '/images/art-1.jpg',
    '/images/art-2.png',
    '/images/art-3.jpg',
]

const GallerySection = () => (
    <section className="px-6 md:px-20 py-24">
        <h2 className="text-yellow text-3xl font-modern-negra mb-12 text-center">Visual Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`Art ${i + 1}`}
                    className="rounded-2xl shadow-lg object-cover h-72 w-full transition-transform hover:scale-105 duration-300"
                />
            ))}
        </div>
    </section>
)

export default GallerySection
