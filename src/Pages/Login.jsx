import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdFastfood } from 'react-icons/md'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    // Simulate login
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 1200)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel – branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-linear-to-br from-orange-500 via-red-500 to-pink-600 p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute bottom-10 right-[-60px] w-60 h-60 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <MdFastfood className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black">FoodRush</span>
        </div>

        {/* Center copy */}
        <div className="z-10">
          <h2 className="text-5xl font-black leading-tight mb-4">
            Good food is<br />just a click away 🍕
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Log in to your account to order from hundreds of restaurants and get your favourite meals delivered hot and fresh.
          </p>
        </div>

        {/* Bottom testimonial */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-5 z-10">
          <p className="text-sm font-medium text-white/90">
            "FoodRush delivers the best food in town in the fastest time. Absolutely love it!"
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">R</div>
            <div>
              <p className="text-sm font-semibold">Rahul Sharma</p>
              <p className="text-xs text-white/60">Regular customer ⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <MdFastfood className="text-white" />
            </div>
            <span className="text-xl font-black text-gray-800">Food<span className="text-orange-500">Rush</span></span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Welcome back 👋</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your FoodRush account</p>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
              <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition">
                <FiMail className="text-gray-400 text-lg shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-orange-500 hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition">
                <FiLock className="text-gray-400 text-lg shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-400 hover:text-gray-600 transition">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 bg-white py-3.5 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition font-semibold text-gray-700 text-sm"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
