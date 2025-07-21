import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const getRandomBrightColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 100%, 70%)`
}

const CocktailGrid = ({ searchTerm }) => {
  const [cocktails, setCocktails] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const cocktailsPerPage = 6
  const containerRef = useRef(null)
  const loaderRef = useRef(null)
  const wrapperRefs = useRef([])
  const shadowRefs = useRef([])

  wrapperRefs.current = []
  shadowRefs.current = []

  useEffect(() => {
    fetch('/products/index')
      .then((res) => res.json())
      .then((data) => {
        setCocktails(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading && loaderRef.current) {
      const dots = loaderRef.current.children
      gsap.to(dots, {
        scale: 1.5,
        opacity: 0.4,
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.03,
          repeat: -1,
          yoyo: true,
        },
        ease: 'power1.inOut',
        duration: 0.25,
      })
    }
  }, [loading])

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power1.out' }
      )
    }
  }, [loading, cocktails])

  const filteredCocktails = cocktails.filter((c) =>
    c.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  const totalPages = Math.ceil(filteredCocktails.length / cocktailsPerPage)
  const indexOfLast = currentPage * cocktailsPerPage
  const indexOfFirst = indexOfLast - cocktailsPerPage
  const currentCocktails = filteredCocktails.slice(indexOfFirst, indexOfLast)

  const handleMouseEnter = (i) => {
    const color = getRandomBrightColor()
    gsap.set(shadowRefs.current[i], { backgroundColor: color })

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

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div ref={loaderRef} className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#e7d393' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
      >
        {currentCocktails.length > 0 ? (
          currentCocktails.map((cocktail, i) => (
            <a
              key={cocktail.id}
              href={`/product/${cocktail.slug}`}
              className="block group"
            >
              <div
                className="relative bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-md transform transition-all duration-300 group-hover:bg-white/20 overflow-visible"
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                <div
                  ref={(el) => (wrapperRefs.current[i] = el)}
                  className="relative h-48 w-full flex justify-center items-center overflow-visible cursor-pointer"
                >
                  <div
                    ref={(el) => (shadowRefs.current[i] = el)}
                    className="absolute z-0 h-48 w-auto pointer-events-none"
                    style={{
                      WebkitMaskImage: `url(/${cocktail.image})`,
                      maskImage: `url(/${cocktail.image})`,
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
                    loading="lazy"
                    src={`/${cocktail.image}`}
                    alt={cocktail.name}
                    className="relative z-10 object-contain h-48 transition-transform duration-300"
                  />
                </div>

                <p className="font-modern-negra text-6xl text-yellow leading-none mt-4 text-center">
                  {cocktail.name}
                </p>
              </div>
            </a>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400 text-xl">
            No cocktails found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4 mb-12 text-sm font-semibold">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${currentPage === 1
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${currentPage === i + 1
                  ? 'bg-yellow text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${currentPage === totalPages
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            Next
          </button>
        </div>
      )}

    </>
  )
}

export default CocktailGrid
