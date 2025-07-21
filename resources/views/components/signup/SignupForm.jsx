import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import AlertDialog from "../reusables/AlertDialog"
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const SignupForm = ({ formRef }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)
    const [toggle, setToggle] = useState(false)

    const buttonRef = useRef(null)

    const handleInput = (e) => {
        const { id, value } = e.target
        setForm({ ...form, [id]: value })
    }

    const handleBlur = (e) => {
        const { id } = e.target
        setTouched({ ...touched, [id]: true })
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setErrors({})
        setStatus(null)
        setLoading(true)

        gsap.fromTo(buttonRef.current,
            { scale: 1 },
            { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
        )

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

        try {
            const registerRes = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(form)
            })

            const data = await registerRes.json()

            if (!registerRes.ok) {
                if (data.errors) {
                    setErrors(data.errors)
                } else {
                    setAlert({ type: 'error', message: 'Something went wrong. Please try again.' })
                }
            } else {
                const loginRes = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                })

                if (loginRes.ok) {
                    setAlert({ type: 'success', message: 'Registration complete! Logging you in...' })

                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1500)
                } else {
                    setAlert({ type: 'error', message: 'Registered, but login failed.' })
                }
            }
        } catch (error) {
            console.error('Signup error:', error)
            setAlert({ type: 'error', message: 'An unexpected error occurred.' })
        } finally {
            setLoading(false)
        }
    }

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none ${errors[field] && touched[field]
            ? 'ring-2 ring-red-500'
            : 'focus:ring-2 focus:ring-yellow'
        } ${field === 'password' ? 'pr-12' : ''}`

    return (
        <div className="md:col-span-2 flex items-center justify-center px-6 py-16 relative z-10">
            {alert && (
                <AlertDialog
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <div
                ref={formRef}
                className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-10 space-y-6"
            >
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-modern-negra text-yellow">Create Account</h1>
                    <p className="text-gray-400 text-sm">Sign up to start your Elixir journey.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSignup}>
                    {['name', 'email', 'password'].map((field) => (
                        <div key={field} className="relative">
                            <label htmlFor={field} className="text-sm text-gray-300 mb-1 block capitalize">
                                {field}
                            </label>

                            <div className="relative">
                                <input
                                    type={field === 'password' ? (toggle ? 'text' : 'password') : field}
                                    id={field}
                                    value={form[field]}
                                    onChange={handleInput}
                                    onBlur={handleBlur}
                                    placeholder={
                                        field === 'name'
                                            ? 'Full Name'
                                            : field === 'email'
                                                ? 'you@example.com'
                                                : '••••••••'
                                    }
                                    required
                                    className={inputClass(field)}
                                />

                                {field === 'password' && (
                                    <button
                                        type="button"
                                        onClick={() => setToggle(!toggle)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow hover:text-white transition duration-300"
                                        aria-label={toggle ? 'Hide password' : 'Show password'}
                                    >
                                        {toggle ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                )}
                            </div>

                            {errors[field] && touched[field] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field][0]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        ref={buttonRef}
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 bg-yellow text-black font-semibold py-3 rounded-lg transition duration-300 shadow-lg hover:bg-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <span className="loader border-2 border-t-2 border-black w-5 h-5 rounded-full animate-spin"></span>
                                Signing up...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                {status && (
                    <p className="text-red-500 text-sm text-center pt-4">{status}</p>
                )}

                <div className="text-center text-sm text-gray-500 pt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-yellow hover:underline">Login</a>
                </div>
            </div>
        </div>
    )
}

export default SignupForm
