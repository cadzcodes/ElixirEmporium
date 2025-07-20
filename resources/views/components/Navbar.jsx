import React, { useState, useRef, useEffect } from 'react'
import { navLinks } from '../../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import useUserStatus from "./statuses/UserStatus"

gsap.registerPlugin(ScrollTrigger)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const userDropdownRef = useRef(null)
  const [user, setUser] = useState(() => {
    return typeof window.__USER__ !== 'undefined' ? window.__USER__ : null
  })
  const hideTimeout = useRef(null)
  const [csrfToken, setCsrfToken] = useState('');


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/user', {
          credentials: 'include', // Needed to send session cookie
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // update state with logged-in user
        } else {
          setUser(null); // not logged in
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);


  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) setCsrfToken(token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const formData = new FormData();
      formData.append('_token', token);

      await fetch('/logout', {
        method: 'POST',
        body: formData,
        credentials: 'include', // required for Laravel session
      });

      window.location.href = '/';
    } catch (err) {
      console.error("Logout failed", err);
    }
  };





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

  const handleUserHover = (entering) => {
    const dropdown = userDropdownRef.current
    if (!dropdown) return

    clearTimeout(hideTimeout.current)

    if (entering) {
      gsap.set(dropdown, { display: 'block' })
      gsap.to(dropdown, {
        opacity: 1,
        y: 8,
        duration: 0.2,
        ease: 'power2.out'
      })
    } else {
      hideTimeout.current = setTimeout(() => {
        gsap.to(dropdown, {
          opacity: 0,
          y: -10,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => gsap.set(dropdown, { display: 'none' })
        })
      }, 100)
    }
  }

  return (
    <nav className="fixed z-50 w-full h-[72px] flex items-center">
      <div className="flex items-center justify-between container mx-auto px-5 py-2">
        <a href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          <p className="font-modern-negra text-3xl">Elixir Emporium</p>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-7 lg:gap-12 ml-auto">
          {navLinks.map(link => (
            <li key={link.id}>
              <a href={link.id}>{link.title}</a>
            </li>
          ))}

          {
            user ? (
              <>
                <li>
                  <a href="/cart" className="relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                  </a>
                </li>
                <li className="relative hidden lg:block">
                  <div
                    onMouseEnter={() => handleUserHover(true)}
                    onMouseLeave={() => handleUserHover(false)}
                    className="relative"
                  >
                    <div className="flex items-center gap-2 cursor-pointer px-3 py-1 hover:bg-white/10 rounded-full">
                      <User size={22} />
                    </div>

                    {/* Dropdown */}
                    <div
                      ref={userDropdownRef}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-black border border-white/10 rounded-lg shadow-lg z-50 hidden pointer-events-auto py-2"
                    >

                      <a
                        href="/account"
                        className="block px-4 py-2 mx-2 rounded-md hover:bg-white/10 transition-all"
                      >
                        My Account
                      </a>

                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handleLogout()
                        }}
                        className="block px-4 py-2 mx-2 rounded-md text-red-400 hover:bg-red-900/30 transition-all"
                      >
                        Logout
                      </a>


                    </div>
                  </div>
                </li>
              </>
            ) : (
              <li>
                <div className="flex items-center gap-2">
                  <a href="/login" className="px-4 h-10 flex items-center border border-white rounded-full hover:border-yellow transition">Login</a>
                  <a href="/signup" className="px-4 h-10 flex items-center bg-yellow text-black rounded-full font-semibold hover:bg-white transition">Sign Up</a>
                </div>
              </li>
            )
          }
        </ul>

        {/* Hamburger Button */}
        <button
          className="lg:hidden text-white ml-auto"
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <ul
        ref={dropdownRef}
        className="hidden flex-col items-center gap-6 bg-black text-white w-full py-6 absolute top-[72px] left-0 z-40 lg:hidden shadow-md border-t border-white/10"
      >
        {navLinks.map(link => (
          <li key={link.id}>
            <a href={link.id} onClick={() => setIsOpen(false)}>{link.title}</a>
          </li>
        ))}

        {
          user ? (
            <>
              <li>
                <a href="/cart" className="relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                </a>
              </li>
              <li>
                <a href="/account" className="text-white px-4 py-2">My Account</a>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  className="text-red-400 hover:bg-red-900/30 rounded-md transition-all px-4 py-2 w-full text-left"
                >
                  Logout
                </button>
              </li>

            </>
          ) : (
            <li>
              <div className="flex flex-col gap-2">
                <a href="/login" className="px-4 py-2 border border-white rounded-full hover:border-yellow transition text-center">Login</a>
                <a href="/signup" className="px-4 py-2 bg-yellow text-black rounded-full font-semibold hover:bg-white transition text-center">Sign Up</a>
              </div>
            </li>
          )
        }
      </ul>
    </nav>
  )
}

export default Navbar
