import React, { useState, useRef, useEffect } from 'react'
import { navLinks } from '../../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Nav blur on scroll
  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        toggleActions: 'play none none reverse'
      }
    }).fromTo('nav',
      { backgroundColor: 'transparent' },
      {
        backgroundColor: '#00000050',
        backdropFilter: 'blur(10px)',
        duration: 1,
        ease: 'power1.inOut'
      }
    )
  }, [])

  // Subtle mobile dropdown animation
  useEffect(() => {
    const dropdown = dropdownRef.current
    if (!dropdown) return

    if (isOpen) {
      gsap.set(dropdown, { display: 'flex' })
      gsap.fromTo(dropdown,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }
      )
    } else {
      gsap.to(dropdown,
        {
          opacity: 0,
          y: -10,
          duration: 0.15,
          ease: 'power1.in',
          onComplete: () => gsap.set(dropdown, { display: 'none' })
        }
      )
    }
  }, [isOpen])

  return (
    <nav className="fixed z-50 w-full">
      <div className="flex items-center justify-between container mx-auto px-5 py-2">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          <p className="font-modern-negra text-3xl">Elixir Emporium</p>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-12 ml-auto">
          {navLinks.map(link => (
            <li key={link.id}>
              <a href={`${link.id}`}>{link.title}</a>
            </li>
          ))}
          <li>
            <div className="flex items-center gap-2">
              <a href="/login" className="px-4 py-2 border border-white rounded-full hover:border-yellow transition">Login</a>
              <a href="/signup" className="px-4 py-2 bg-yellow text-black rounded-full font-semibold hover:bg-white transition">Sign Up</a>
            </div>
          </li>
        </ul>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden text-white ml-auto"
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <ul
        ref={dropdownRef}
        className="md:hidden flex-col items-center gap-5 py-4 bg-black/90 backdrop-blur text-white transition-all hidden"
      >
        {navLinks.map(link => (
          <li key={link.id}>
            <a href={`${link.id}`} onClick={() => setIsOpen(false)}>
              {link.title}
            </a>
          </li>
        ))}
        <li>
          <a href="/login" className="px-4 py-2 border border-white rounded-full hover:border-yellow transition">Login</a>
        </li>
        <li>
          <a href="/signup" className="px-4 py-2 bg-yellow text-black rounded-full font-semibold hover:bg-white transition">Sign Up</a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
