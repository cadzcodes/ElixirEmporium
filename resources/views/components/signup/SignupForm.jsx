import React, { useRef } from 'react'

const SignupForm = ({ formRef, handleSignup }) => (
  <div className="md:col-span-2 flex items-center justify-center px-6 py-16 relative z-10">
    <div
      ref={formRef}
      className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-10 space-y-6"
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-modern-negra text-yellow">Create Account</h1>
        <p className="text-gray-400 text-sm">Sign up to start your Elixir journey.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSignup}>
        <div>
          <label htmlFor="name" className="text-sm text-gray-300 mb-1 block">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-gray-300 mb-1 block">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 shadow-lg"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center text-sm text-gray-500 pt-4">
        Already have an account?{' '}
        <a href="#" className="text-yellow hover:underline">Login</a>
      </div>
    </div>
  </div>
)

export default SignupForm
