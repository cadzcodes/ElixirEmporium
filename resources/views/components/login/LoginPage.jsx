import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import gsap from 'gsap'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

const LoginPage = () => {
  const formRef = useRef(null)
  const toastRef = useRef(null)
  const [toggle, setToggle] = useState(true)
  const [status, setStatus] = useState(null)

  // Initial animation
  useEffect(() => {
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    })
  }, [])

  // Animate toast when status changes
  useLayoutEffect(() => {
    if (!status || !toastRef.current) return

    const tl = gsap.timeline()

    tl.fromTo(
      toastRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
      }
    ).to(toastRef.current, {
      opacity: 0,
      y: -20,
      delay: 2,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => setStatus(null),
    })
  }, [status])

  const handleLogin = (e) => {
    e.preventDefault()
    const isSuccess = toggle
    setStatus(isSuccess ? 'success' : 'error')
    setToggle(!toggle)
  }

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] flex items-center justify-center px-6 py-12 overflow-hidden">
      
      {/* Background Blur */}
      <div className="absolute inset-0 bg-[url('/images/login-bg.jpg')] bg-cover bg-center opacity-10 blur-sm" />

      {/* Toast Message */}
      {status && (
        <div
          ref={toastRef}
          className={`fixed top-8 z-50 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl text-white flex items-center gap-3 text-lg font-medium
            ${status === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {status === 'success' ? (
            <>
              <FaCheckCircle className="text-white text-xl" />
              Login Successful!
            </>
          ) : (
            <>
              <FaExclamationCircle className="text-white text-xl" />
              Login Failed. Try again.
            </>
          )}
        </div>
      )}

      {/* Login Form */}
      <div
        ref={formRef}
        className="relative z-10 w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-10 text-white space-y-6"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-modern-negra text-yellow">Elixir</h1>
          <p className="text-gray-400 text-sm">Welcome back. Please sign in.</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-yellow w-5 h-5 transition-all duration-200 ease-in-out"
              />
              Remember me
            </label>
            <a href="#" className="hover:underline text-yellow">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 pt-4">
          Don’t have an account?{' '}
          <a href="#" className="text-yellow hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
