import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const HeroSection = () => {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    const rawText = titleRef.current.textContent
    const splitText = rawText.split('').map(char => {
      const safeChar = char === ' ' ? '&nbsp;' : char
      return `<span class="inline-block opacity-0 translate-y-4 skew-y-3">${safeChar}</span>`
    }).join('')

    titleRef.current.innerHTML = splitText

    gsap.to(titleRef.current.querySelectorAll('span'), {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.04,
    })

    gsap.fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, delay: 1.2, duration: 1, ease: 'power2.out' }
    )
  }, [])

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-32 overflow-hidden">
      <h1
        ref={titleRef}
        className="text-yellow text-5xl md:text-7xl font-modern-negra tracking-wide leading-tight"
      >
        The Art of Elixirs
      </h1>
      <p
        ref={subtitleRef}
        className="text-gray-300 mt-6 max-w-xl text-lg"
      >
        Where liquid craftsmanship meets timeless visual elegance.
      </p>
    </section>
  )
}

export default HeroSection
