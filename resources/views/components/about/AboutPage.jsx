import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import Section from "./Section"

gsap.registerPlugin(ScrollTrigger, TextPlugin)

const AboutPage = () => {
  const heroRef = useRef(null)
  const sectionRefs = useRef([])

  useEffect(() => {
    const h1 = heroRef.current.querySelector('h1')
    const p = heroRef.current.querySelector('p')

    // Hero animation (safe)
    gsap.fromTo(
      h1,
      { text: '' },
      {
        duration: 2,
        text: 'About Our Craft',
        ease: 'power2.out',
        delay: 0.3,
      }
    )

    gsap.from(p, {
      autoAlpha: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out',
      delay: 1.5,
    })

    // Animate sections AFTER idle to avoid layout thrashing
    const triggerAnimations = () => {
      sectionRefs.current.forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          yPercent: 10,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(triggerAnimations)
    } else {
      // Fallback for unsupported browsers
      setTimeout(triggerAnimations, 200)
    }

    // Ensure ScrollTrigger recalculates after layout
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)
  }, [])

  return (
    <section className="bg-[#0e0e0e] text-white overflow-x-hidden">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center px-6 py-24 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-modern-negra text-yellow mb-6 leading-tight"></h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          We create timeless blends, hand-crafted in small batches. Every bottle embodies precision, heritage, and luxury.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-32 px-6 md:px-20 py-20">
        <Section
          ref={(el) => (sectionRefs.current[0] = el)}
          image="/images/about.webp"
          title="Rooted in Heritage"
          description="Our journey began with a passion to preserve traditional methods while embracing innovation. Every drop pays homage to centuries of craftsmanship."
        />
        <Section
          ref={(el) => (sectionRefs.current[1] = el)}
          image="/images/about2.webp"
          title="The Craft Process"
          description="From botanical selection to distillation and aging, our meticulous process ensures unmatched taste and quality. Each batch is monitored by artisans."
          reverse
        />
        <Section
          ref={(el) => (sectionRefs.current[2] = el)}
          image="/images/about3.webp"
          title="The Experience"
          description="Savor an experience that's more than just a drink — it's a ritual, an atmosphere, a statement. Elegance in every pour."
        />
      </div>

      {/* Call to Action */}
      <div className="bg-[#1a1a1a] py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-modern-negra text-yellow mb-4">
          Discover the Elixir
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Join our journey into refinement. Taste the uncommon. Celebrate the extraordinary.
        </p>
        <button className="bg-yellow text-black px-8 py-3 rounded-full font-semibold hover:bg-white transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2">
          Explore Collection
        </button>
      </div>
    </section>
  )
}

export default AboutPage
