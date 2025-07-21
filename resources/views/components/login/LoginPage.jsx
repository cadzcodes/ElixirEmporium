import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import gsap from 'gsap'
import { FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import AlertDialog from "../reusables/AlertDialog"

const LoginPage = () => {
  const formRef = useRef(null)
  const toastRef = useRef(null)
  const buttonRef = useRef(null)

  const [toggle, setToggle] = useState(true)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [alert, setAlert] = useState(null)

  const [passwordValue, setPasswordValue] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)

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

  const handleLogin = async (e) => {
    e.preventDefault()
    setAlert(null)
    setLoading(true)

    gsap.fromTo(buttonRef.current,
      { scale: 1 },
      { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
    )

    try {
      const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      }

      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setAlert({ type: 'error', message: 'Invalid login credentials.' })
      } else {
        setAlert({ type: 'success', message: 'Login successful!' })
        setTimeout(() => window.location.href = '/', 2000)
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] flex items-center justify-center px-6 py-12 overflow-hidden">

      {alert && (
        <AlertDialog
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

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
            <div className="relative">
              <input
                type={toggle ? "password" : "text"}
                id="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                required
              />
              {(passwordFocused || passwordValue.length > 0) && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setToggle(!toggle)}
                    className="text-yellow hover:text-white transition duration-300"
                    aria-label={toggle ? "Show password" : "Hide password"}
                  >
                    {toggle ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                  </button>
                </div>
              )}
            </div>
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
            ref={buttonRef}
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-yellow text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="loader border-2 border-t-2 border-black w-5 h-5 rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
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
