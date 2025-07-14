import React from 'react'

const ShowcaseSection = () => (
    <section className="px-6 md:px-20 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
            <img
                src="/images/art-showcase.png"
                alt="Art Showcase"
                className="rounded-3xl shadow-2xl w-full object-cover max-h-[500px]"
            />
        </div>
        <div>
            <h2 className="text-yellow text-4xl font-modern-negra mb-4">Golden Harmony</h2>
            <p className="text-gray-400 leading-loose">
                Every bottle isn’t just a drink — it’s a canvas. Wrapped in minimalist detail, balanced with gilded accents, each design is rooted in elegance and symbolic heritage.
            </p>
        </div>
    </section>
)

export default ShowcaseSection
