import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const getRandomBrightColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 100%, 70%)`
}

const cocktails = [
  { id: 1, name: 'Mojito', image: '/images/mojito.png' },
  { id: 2, name: 'Margarita', image: '/images/margarita.png' },
  { id: 3, name: 'Old Fashioned', image: '/images/oldfashion.png' },
  { id: 4, name: 'Cosmopolitan', image: '/images/cosmopolitan.png' },
  { id: 5, name: 'Negroni', image: '/images/negroni.png' },
  { id: 6, name: 'Whiskey Sour', image: '/images/whiskeysour.png' },
]

const CocktailGrid = ({ searchTerm }) => {
  const containerRef = useRef(null)

  const filteredCocktails = cocktails.filter(c =>
    c.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  // Animation on mount
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.out',
      }
    )
  }, [searchTerm]) // fade only when searchTerm changes

  const wrapperRefs = useRef([])
  const shadowRefs = useRef([])

  // Reset refs on render
  wrapperRefs.current = []
  shadowRefs.current = []

  const handleMouseEnter = (i) => {
    const color = getRandomBrightColor()

    gsap.set(shadowRefs.current[i], {
      backgroundColor: color,
    })

    gsap.to(wrapperRefs.current[i], {
      scale: 1.5,
      y: -20,
      rotate: 5,
      duration: 0.4,
      ease: 'power3.out',
    })

    gsap.fromTo(
      shadowRefs.current[i],
      { opacity: 0, x: 0, y: 0 },
      { opacity: 0.8, x: 10, y: 10, duration: 0.4, ease: 'power3.out' }
    )
  }

  const handleMouseLeave = (i) => {
    gsap.to(wrapperRefs.current[i], {
      scale: 1,
      y: 0,
      rotate: 0,
      duration: 0.4,
      ease: 'power3.out',
    })

    gsap.to(shadowRefs.current[i], {
      opacity: 0,
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
    })
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {filteredCocktails.length > 0 ? (
        filteredCocktails.map((cocktail, i) => (
          <div
            key={cocktail.id}
            className="relative bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-md transform transition-all duration-300 hover:bg-white/20 overflow-visible"
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
          >
            <div
              ref={el => wrapperRefs.current[i] = el}
              className="relative h-48 w-full flex justify-center items-center overflow-visible cursor-pointer"
            >
              <div
                ref={el => shadowRefs.current[i] = el}
                className="absolute z-0 h-48 w-auto pointer-events-none"
                style={{
                  WebkitMaskImage: `url(${cocktail.image})`,
                  maskImage: `url(${cocktail.image})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  backgroundColor: 'transparent',
                  width: '100px',
                  height: '100%',
                }}
              />
              <img
                src={cocktail.image}
                alt={cocktail.name}
                className="relative z-10 object-contain h-48 transition-transform duration-300"
              />
            </div>

            <p className="font-modern-negra text-6xl text-yellow leading-none mt-4 text-center">
              {cocktail.name}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center col-span-full text-gray-400 text-xl">
          No cocktails found.
        </p>
      )}
    </div>
  )
}

export default CocktailGrid
