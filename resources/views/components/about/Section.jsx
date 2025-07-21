import React from 'react'

const Section = React.forwardRef(({ image, title, description, reverse = false }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center gap-12`}
    >
      <div className="w-full md:w-1/2">
        <img
          src={image}
          alt={title}
          className="w-full h-auto max-h-[80vh] object-cover rounded-xl shadow-lg"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-6">
        <h3 className="text-3xl md:text-4xl text-yellow font-modern-negra">{title}</h3>
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  )
})

export default Section
