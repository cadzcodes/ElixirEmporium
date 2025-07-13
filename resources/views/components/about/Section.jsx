import React from 'react'

const Section = React.forwardRef(({ image, title, description, reverse = false }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row ${
        reverse ? 'md:flex-row-reverse' : ''
      } items-center gap-10`}
    >
      <div className="w-full md:w-1/2 aspect-square overflow-hidden rounded-3xl shadow-lg">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-3xl md:text-4xl font-modern-negra text-yellow">{title}</h3>
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  )
})

export default Section
